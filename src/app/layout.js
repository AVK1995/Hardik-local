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
        {/* Reveals fail open: this only arms the hidden state once JS is confirmed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js');",
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
