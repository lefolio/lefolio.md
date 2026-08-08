'use client';

import Link from 'next/link';
import type { ContentManifest, NavItem } from '@/lib/content/types';

interface NavbarProps {
  manifest: ContentManifest;
}

function NavAnchor({ item, className }: { item: NavItem; className: string }) {
  if (item.type === 'external' || /^(https?:|mailto:|tel:)/i.test(item.href)) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

export default function Navbar({ manifest }: NavbarProps) {
  const { config, navigation, logo } = manifest;
  const siteTitle = config.site.title;
  const cta = config.cta;

  return (
    <header className="salo-header">
      <div className="salo-container salo-header-inner">
        <Link href="/" className="salo-brand">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={siteTitle} className="salo-logo" />
          ) : (
            <span className="salo-brand-text">{siteTitle}</span>
          )}
        </Link>
        <nav className="salo-nav" aria-label="Main">
          {navigation.map((item) => (
            <NavAnchor
              key={`${item.label}-${item.href}`}
              item={item}
              className="salo-nav-link"
            />
          ))}
        </nav>
        {cta?.href && cta.label ? (
          <a
            href={cta.href}
            className="salo-btn salo-btn-primary salo-header-cta"
            target={/^(https?:)/i.test(cta.href) ? '_blank' : undefined}
            rel={/^(https?:)/i.test(cta.href) ? 'noopener noreferrer' : undefined}
          >
            {cta.label}
            <svg
              viewBox="0 0 24 24"
              className="salo-header-cta-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </a>
        ) : null}
      </div>
    </header>
  );
}
