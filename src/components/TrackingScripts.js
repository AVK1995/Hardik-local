'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import { TRACKING_HOST } from '@/lib/config';
import { captureLandingParams } from '@/lib/utm';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || '';

/* ═══════════════════════════════════════════════════════════════════════════
   All three browser trackers, in one place, behind one gate.

   ── The host gate ────────────────────────────────────────────────────────
   Each snippet refuses to run unless it is on the production host. Without
   this, localhost and every Vercel preview deploy would pollute the same GA4
   property and Clarity project the client reads their numbers from — and Meta
   silently drops events from non-allow-listed domains anyway, so a preview
   pixel is noise that produces nothing.

   The cost is that none of this can be exercised on localhost. To test
   locally, run in the browser console and reload:

       localStorage.setItem('apw_tracking_debug', '1')

   ── Why the Meta snippet is written the way it is ────────────────────────
   The MAM cookie is read and passed to a second fbq('init') BEFORE
   fbq('track','PageView'). That ordering is the entire point: it means a
   returning visitor's very first pageview already carries his hashed identity
   (EMQ ~8) instead of arriving anonymous (EMQ ~6). Move the PageView above
   the cookie read and you quietly lose that on every return visit.

   The browser fires PageView and nothing else. Every conversion event is
   server-side CAPI — see src/lib/meta-capi.js for why that is not optional
   on a health-categorised dataset.
   ═══════════════════════════════════════════════════════════════════════════ */

const HOST_GATE = `(location.hostname === ${JSON.stringify(TRACKING_HOST)} || (function(){ try { return localStorage.getItem('apw_tracking_debug') === '1'; } catch (e) { return false; } })())`;

export default function TrackingScripts() {
  useEffect(() => {
    /* First-touch UTM + fbclid capture. Runs on every page, stores once, so
       the params survive the landing → checkout hop where the query is lost. */
    captureLandingParams();
  }, []);

  return (
    <>
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              if (${HOST_GATE}) {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', '${META_PIXEL_ID}');

                try {
                  var m = document.cookie.match(/(?:^|;\\s*)apw_mam=([^;]+)/);
                  if (m) {
                    var mam = JSON.parse(decodeURIComponent(m[1]));
                    if (mam && typeof mam === 'object' && Object.keys(mam).length) {
                      fbq('init', '${META_PIXEL_ID}', mam);
                    }
                  }
                } catch (e) {}

                fbq('track', 'PageView');
              }
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {GA4_ID && (
        <Script id="ga4" strategy="afterInteractive">
          {`
            if (${HOST_GATE}) {
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA4_ID}';
              document.head.appendChild(s);

              window.dataLayer = window.dataLayer || [];
              /* gtag pushes its own arguments object — this is NOT the same as
                 dataLayer.push({event:'x'}), which a raw gtag.js install (no
                 GTM container) ignores entirely. */
              function gtag(){ dataLayer.push(arguments); }
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            }
          `}
        </Script>
      )}

      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            if (${HOST_GATE}) {
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            }
          `}
        </Script>
      )}
    </>
  );
}
