'use client';

import Navbar from './Navbar';
import type { ContentManifest } from '@/lib/content/types';

interface SiteShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  const { config, logo } = manifest;
  const year = new Date().getFullYear();
  const links = config.author?.links || {};
  const siteTitle = config.site.title;
  const description =
    config.site.description ||
    'Premium underwear, swimwear & sportswear designed for comfort and style.';

  return (
    <div className="salo-shell min-h-screen">
      <Navbar manifest={manifest} />
      <main className="salo-main">{children}</main>
      <footer className="salo-footer">
        <div className="salo-container">
          <div className="salo-footer-grid">
            <div className="salo-footer-brand">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={siteTitle} className="salo-footer-logo" />
              ) : (
                <p className="salo-footer-title">{siteTitle}</p>
              )}
              <p className="salo-footer-tagline">{description}</p>
              <div className="salo-footer-social">
                {links.instagram ? (
                  <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                ) : null}
                {links.facebook ? (
                  <a href={links.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                ) : null}
                {links.twitter ? (
                  <a href={links.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                ) : null}
              </div>
            </div>
            <div>
              <h3 className="salo-footer-heading">Shop</h3>
              <ul className="salo-footer-list">
                {manifest.navigation.map((item) => {
                  const external =
                    item.type === 'external' || /^(https?:|mailto:|tel:)/i.test(item.href);
                  return (
                    <li key={`footer-${item.label}`}>
                      <a
                        href={item.href}
                        {...(external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="salo-footer-heading">Information</h3>
              <ul className="salo-footer-list">
                <li>
                  <a href="https://ericsalodesign.com/pages/about-us" target="_blank" rel="noopener noreferrer">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://ericsalodesign.com/pages/contact" target="_blank" rel="noopener noreferrer">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://ericsalodesign.com/policies/shipping-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shipping &amp; Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="salo-footer-heading">Contact</h3>
              <ul className="salo-footer-list">
                {links.email ? <li>Email: {links.email}</li> : null}
                <li>Phone: +61 1300 853 569</li>
                <li>FREE Shipping on USA Orders USD $35+</li>
              </ul>
            </div>
          </div>
          <p className="salo-footer-copy">
            © {year} {siteTitle}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
