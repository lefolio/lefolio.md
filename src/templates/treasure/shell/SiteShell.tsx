'use client';

import Navbar from './Navbar';
import type { ContentManifest } from '@/lib/content/types';

interface SiteShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  const handle =
    manifest.config.author?.name?.trim() ||
    manifest.config.site.title?.trim() ||
    '@ovelii';
  const brand = handle.startsWith('@') ? handle : `@${handle}`;

  return (
    <div className="treasure-shell">
      <Navbar manifest={manifest} />
      <main className="treasure-main">{children}</main>
      <footer className="treasure-footer">
        <div className="treasure-container flex items-center justify-between gap-4 py-8 text-sm">
          <p className="text-muted m-0">{brand}</p>
          <p className="text-muted m-0">
            powered by{' '}
            <a
              href="https://lefolio.md"
              className="treasure-footer-credit"
              target="_blank"
              rel="noopener noreferrer"
            >
              lefolio.md
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
