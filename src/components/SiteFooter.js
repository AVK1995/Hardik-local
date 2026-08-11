import { siteFooter } from '@/lib/content';

/**
 * The one footer, shared by every page off the landing page. The landing page
 * keeps its own colophon inside the closing dark band, because there the
 * footer is part of the finale rather than a separate slab.
 *
 * The disclaimer line is not decoration. This site sells a health consultation
 * and shows transformation photos, so "educational, not medical advice, results
 * are not typical" belongs on every page, not buried one click away.
 */
export default function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sdp-wrap sf-inner">
        <div className="sf-brand">
          <span className="sf-name">{siteFooter.brand}</span>
          <span className="sf-tag">{siteFooter.tagline}</span>
        </div>

        <nav className="sf-links" aria-label="Legal">
          {siteFooter.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="sdp-wrap sf-fine">
        <p>{siteFooter.disclaimer}</p>
        <p className="sf-copy">{siteFooter.copyright}</p>
      </div>
    </footer>
  );
}
