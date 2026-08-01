'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ContentManifest } from '@/lib/content/types';

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
  const siteTitle = manifest.config.site.title;

  return (
    <header className="portfolio-header">
      <div className="portfolio-container portfolio-header-inner">
        <Link href="/" className="portfolio-brand">
          {siteTitle}
        </Link>
        <nav className="portfolio-nav" aria-label="Main">
          {manifest.navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={active ? 'portfolio-nav-link is-active' : 'portfolio-nav-link'}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
