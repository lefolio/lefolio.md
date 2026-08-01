'use client';

import Navbar from './Navbar';
import type { ContentManifest } from '@/lib/content/types';

interface SiteShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  const year = new Date().getFullYear();
  const name = manifest.config.author?.name || manifest.config.site.title;

  return (
    <div className="portfolio-shell min-h-screen">
      <Navbar manifest={manifest} />
      <main className="portfolio-main">{children}</main>
      <footer className="portfolio-footer">
        <div className="portfolio-container">
          <p>
            © {year} {name}
          </p>
        </div>
      </footer>
    </div>
  );
}
