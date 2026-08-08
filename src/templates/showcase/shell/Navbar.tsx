'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ContentManifest } from '@/lib/content/types';
import BrandName from './BrandName';

function isActive(pathname: string, href: string) {
  const normalized = href.replace(/\/$/, '') || '/';
  const current = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return current === '/';
  return current === normalized || current.startsWith(`${normalized}/`);
}

interface NavbarProps {
  manifest: ContentManifest;
}

export default function Navbar({ manifest }: NavbarProps) {
  const pathname = usePathname();
  const { config, navigation } = manifest;
  const siteTitle = config.site.title;
  const github =
    config.author?.links?.github || 'https://github.com/lefolio/lefolio.md';

  return (
    <header className="showcase-header sticky top-0 z-50 border-b backdrop-blur">
      <div className="showcase-container flex items-center justify-between gap-6 py-4">
        <Link href="/" className="showcase-brand flex items-center gap-3 no-underline">
          <BrandName name={siteTitle} className="showcase-brand-name--nav" />
        </Link>

        <nav className="flex items-center gap-6" aria-label="Main">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            const className = active ? 'showcase-nav showcase-nav-active' : 'showcase-nav';
            if (item.type === 'external' || /^(https?:|mailto:|tel:)/i.test(item.href)) {
              return (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={className}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={`${item.label}-${item.href}`} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
          <a
            href={github}
            className="showcase-cta-secondary hidden sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
