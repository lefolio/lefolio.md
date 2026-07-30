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
  const handle =
    manifest.config.author?.name?.trim() ||
    manifest.config.site.title?.trim() ||
    '@ovelii';
  const brand = handle.startsWith('@') ? handle : `@${handle}`;

  return (
    <header className="treasure-header sticky top-0 z-50">
      <div className="treasure-container flex items-center justify-between gap-6 py-5">
        <Link href="/" className="treasure-brand">
          {brand}
        </Link>

        <nav className="ml-auto flex items-center gap-6" aria-label="Main">
          {manifest.navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={active ? 'treasure-nav treasure-nav-active' : 'treasure-nav'}
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
