import { Bebas_Neue, Manrope } from 'next/font/google';
import './globals.css';

/* Type roles never swap, only the faces do:
   --fh = DISPLAY (condensed all-caps) · --fb = BODY (clean geometric) */
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
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
  themeColor: '#0A0F1E',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`no-js ${bebas.variable} ${manrope.variable}`}>
      <head>
        {/* Reveals fail open: this only arms the hidden state once JS is confirmed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js');",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
