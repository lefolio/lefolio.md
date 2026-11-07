import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { loadManifest } from '@lefolio/engine/content';
import { DocumentLang, MarkdownComponentsProvider } from '@lefolio/engine/markdown';
import '@lefolio/engine/globals.css';
import { CONTENT_VERSION } from '../.content/content-version';
import { markdownComponents } from '@/lib/markdown-components';
import SiteShell from '@/shell/SiteShell';
import '../styles.css';

/** 1×1 transparent GIF — used when the site omits `favicon:` so browsers don't keep a stale /favicon.ico. */
const EMPTY_FAVICON =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export function generateMetadata(): Metadata {
  const manifest = loadManifest();
  return {
    title: manifest.config.site.title,
    description: manifest.config.site.description,
    icons: manifest.favicon
      ? { icon: manifest.favicon }
      : { icon: [{ url: EMPTY_FAVICON, type: 'image/gif', sizes: '1x1' }] },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const manifest = loadManifest();
  void CONTENT_VERSION;

  return (
    <html
      lang={manifest.lang}
      data-template="showcase"
      data-scroll-behavior="smooth"
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <DocumentLang fallback={manifest.lang} routeLangs={manifest.routeLangs} />
        <MarkdownComponentsProvider components={markdownComponents} colorScheme="light">
          <SiteShell manifest={manifest}>{children}</SiteShell>
        </MarkdownComponentsProvider>
      </body>
    </html>
  );
}
