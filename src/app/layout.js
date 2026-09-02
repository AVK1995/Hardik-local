import { Schibsted_Grotesk, Manrope } from 'next/font/google';
import '@/styles/globals.css';

import TrackingScripts from '@/components/TrackingScripts';

/* Type roles never swap, only the faces do:
   --fh = DISPLAY (heavy editorial grotesque) · --fb = BODY (clean geometric)
   Display carries real weights and true lowercase, so headlines can run in
   sentence case instead of being forced into all-caps by the face. */
const display = Schibsted_Grotesk({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'Project Alpha Wellness — Get off the blue pill in the next 90 days',
  description:
    'Root-cause men’s health. Testosterone is the master signal. Book a Rs 97 root-cause call and get your reports read live.',
  robots: { index: false, follow: false }, // pre-launch
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#071A33', // Deep Navy, matches --bg-dark in the new palette
};

export default function RootLayout({ children }) {
  return (
    /* suppressHydrationWarning is required, not a workaround: the head script
       below strips `no-js` from <html> before React hydrates, so the server
       markup and the live DOM differ by design. It suppresses the mismatch on
       this element's attributes only, not on any child. */
    <html
      lang="en"
      className={`no-js ${display.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Two jobs, one inline script so it costs no extra request.

            1. Reveals fail open (the original job): arm the hidden state only
               once JS is confirmed.

            2. Recover a page whose CSS 404d. An in-app browser (Instagram on
               Android) can replay HTML from an older deploy, and that HTML
               names content-hashed stylesheets that no longer exist — see the
               long note in middleware.js. Result: a live, unstyled checkout.
               If a sheet is missing we reload ONCE with a cache-busting param,
               turning a broken page into a brief flicker.

            Two things here look wrong and are not — both were measured in a
            headless browser against the real build, so do not "tidy" them:

            • It polls instead of listening for a stylesheet error event. Next
              emits the <link> tags BEFORE any script in <head>, and resource
              error events neither bubble nor replay — a listener would attach
              after the event had already fired and would silently never run.

            • It tests cssRules.length, not link.sheet. A 404d stylesheet does
              NOT leave sheet null: Chrome attaches a sheet with ZERO rules.
              (Measured: healthy sheet 189 rules, 404d sheet 0.)

            The 500ms delay after DOMContentLoaded avoids reading a sheet
            mid-parse; a spurious reload on a HEALTHY page would be worse than
            the bug being fixed. sessionStorage caps it at one attempt per
            session, so a reload that is also broken cannot loop. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.remove('no-js');(function(){var K='__cssRecover';function broken(){var l=document.querySelectorAll('link[rel=\"stylesheet\"][href*=\"/_next/static/css/\"]');if(!l.length)return false;for(var i=0;i<l.length;i++){var sh=l[i].sheet;if(!sh)return true;try{if(sh.cssRules.length===0)return true;}catch(e){}}return false;}function check(){try{if(!broken()){sessionStorage.removeItem(K);return;}if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,'1');var s=location.search,u=location.pathname+(s?s+'&':'?')+'__r='+Date.now()+location.hash;location.replace(u);}catch(e){}}function arm(){setTimeout(check,500);}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',arm);}else{arm();}window.addEventListener('load',check);window.addEventListener('load',function(){try{var sp=new URLSearchParams(location.search);if(!sp.has('__r'))return;sp.delete('__r');var q=sp.toString();history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash);}catch(e){}});})();",
          }}
        />
      </head>
      <body>
        {children}
        {/* Meta Pixel (PageView + MAM only), GA4 and Clarity. Loaded after
            interactive so none of them delay the VSL's first paint. */}
        <TrackingScripts />
      </body>
    </html>
  );
}
