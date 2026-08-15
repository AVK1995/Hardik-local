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

  return res;
}

/* Pages only. Skipping _next, the API routes and static assets keeps this off
   the hot path — and the API routes read the cookie rather than setting it. */
export const config = {
  matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|icon0.svg|icon1.png|apple-icon.png|manifest.json|proof/|Certificates/).*)'],
};
