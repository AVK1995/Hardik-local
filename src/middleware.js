import { NextResponse } from 'next/server';

import {
  ATTR_COOKIE,
  ATTR_TTL_SECONDS,
  mergeAttribution,
  parseAttributionFromUrl,
  readAttrCookie,
} from '@/lib/attribution';

/* ═══════════════════════════════════════════════════════════════════════════
   L1 — server-side attribution capture at the edge.

   This runs on the FIRST request, before a byte of HTML is sent and long
   before React hydrates. It is the layer that makes attribution reliable.

   Why it exists: lead pay_TPvkniUArkCDLM paid from the Facebook iOS in-app
   browser with every utm_* blank, even though the ad URL was fully tagged.
   Capture lived in a React useEffect; the man tapped the CTA before the
   landing page finished hydrating, so the effect never ran. The Meta pixel
   (a plain <script>, not a React effect) had already fired — which is exactly
   why _fbc survived and our own attribution did not.

   Middleware cannot lose that race. There is no hydration, no effect, no
   bundle to download; the query string is read off the request itself.

   The client-side capture in lib/utm.js still runs, but it is now a
   supplement (client-side route changes, belt-and-braces) rather than the
   load-bearing layer.
   ═══════════════════════════════════════════════════════════════════════════ */

export function middleware(req) {
  const res = NextResponse.next();

  try {
    const live = parseAttributionFromUrl(req.nextUrl.search);
    const stored = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);

    const { attr, changed } = mergeAttribution(stored, {
      live,
      landingUrl: req.nextUrl.href,
      referrer: req.headers.get('referer') || '',
      now: Date.now(),
    });

    /* Only write when something actually changed: attribution is last-touch,
       context is first-touch, and an untagged internal navigation must not
       churn the cookie on every page view. */
    /* Raw JSON, NOT encodeURIComponent'd: NextResponse.cookies.set() already
       percent-encodes. Pre-encoding here double-encoded the value, so the
       browser-side reader (one decodeURIComponent) failed to parse it, treated
       storage as empty, and overwrote the middleware's capture with
       landing_url=/checkout — reintroducing the very bug this layer fixes.
       Caught in production via the Set-Cookie header showing %257B ('{'
       encoded twice). */
    if (changed) {
      res.cookies.set(ATTR_COOKIE, JSON.stringify(attr), {
        path: '/',
        maxAge: ATTR_TTL_SECONDS,
        sameSite: 'lax',
        httpOnly: false, // lib/utm.js reads it client-side as a fallback
        secure: req.nextUrl.protocol === 'https:',
      });
    }
  } catch {
    /* Attribution must never be able to break page delivery. */
  }

  /* ── Never let a document be served from a stale cache ──────────────────
     2026-09-01: Instagram/Android in-app browser users were landing on an
     unstyled checkout. The IAB caches the HTML document hard, so it replayed
     HTML from an earlier deploy — and that HTML names CONTENT-HASHED assets:

       <link href="/_next/static/css/<hash>.css">

     A hash only changes when the file changes. globals.css had been stable,
     so its link still resolved and the pay button stayed styled; funnel-pages
     .css changes most deploys, so its hash moved and the old URL 404d. That
     is the exact split seen in the recordings, and it is why it read as
     "CSS is broken" rather than "this one asset is gone".

     Documents must therefore always be revalidated. Static assets are NOT
     touched — the matcher below excludes _next/static, so they keep their
     immutable long cache. Only the HTML stops being reusable, which is the
     one thing that has to be current for the hashes inside it to resolve.

     This is the free half of the fix. Vercel Skew Protection is the other
     half (it also covers JS chunks, where the symptom is a page that looks
     perfect and a pay button that silently does nothing); it is a Pro
     feature and is currently disabled on this project. */
  res.headers.set('Cache-Control', 'no-store, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');

  return res;
}

/* Pages only. Skipping _next, the API routes and static assets keeps this off
   the hot path — and the API routes read the cookie rather than setting it. */
export const config = {
  matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|icon0.svg|icon1.png|apple-icon.png|manifest.json|proof/|Certificates/).*)'],
};
