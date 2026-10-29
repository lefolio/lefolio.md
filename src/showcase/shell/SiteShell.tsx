'use client';

import type { ReactNode } from 'react';
import Script from 'next/script';
import Navbar from './Navbar';
import { SiteConfigProvider } from '../lib/site';
import type { ContentManifest } from '@lefolio/engine/template';

interface SiteShellProps {
  manifest: ContentManifest;
  children: ReactNode;
}

function goatCounterEndpoint(config: ContentManifest['config']): string | null {
  const analytics = config.analytics as { goatcounter?: unknown } | undefined;
  if (typeof analytics?.goatcounter !== 'string') return null;
  const endpoint = analytics.goatcounter.trim();
  return endpoint || null;
}

export default function SiteShell({ manifest, children }: SiteShellProps) {
  const goatCounter = goatCounterEndpoint(manifest.config);

  return (
    <div className="showcase-shell min-h-screen">
      {goatCounter ? (
        <Script
          src="https://gc.zgo.at/count.js"
          data-goatcounter={goatCounter}
          strategy="afterInteractive"
        />
      ) : null}
      <Navbar manifest={manifest} />
      <SiteConfigProvider config={manifest.config}>
        <main className="showcase-main">{children}</main>
      </SiteConfigProvider>
      <footer className="showcase-footer border-t">
        <div className="showcase-container flex flex-wrap items-center justify-between gap-3 py-8 text-sm">
          <p className="text-muted">{manifest.config.site.title}</p>
          <p className="text-muted">
            Built with:{' '}
            <a
              className="link-primary"
              href="https://github.com/lefolio/lefolio.md"
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
