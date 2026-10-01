import { thankYou } from '@/lib/content';

/**
 * A server layout exists for this route purely to own the tab title.
 *
 * page.js is a client component and cannot be anything else — it reads
 * Calendly's redirect params — so it cannot export metadata itself. The two
 * client-side routes around that were tried and both lose:
 *
 *   document.title in an effect   Next applies the route's metadata title
 *                                 AFTER hydration effects run, so the
 *                                 assignment was overwritten every time. It
 *                                 looked correct and did nothing.
 *   a rendered <title> element    React 19 hoists it, but Next's metadata
 *                                 title still wins and the head ends up with
 *                                 three <title> tags.
 *
 * A segment layout is the supported way: the title is in the HTML from the
 * first byte, there is exactly one of it, and nothing races it. Worth doing
 * because the tab is often the only part of this page still visible once the
 * man has switched over to WhatsApp.
 */
export const metadata = {
  title: thankYou.confirm.title,
};

export default function ThankYouLayout({ children }) {
  return children;
}
