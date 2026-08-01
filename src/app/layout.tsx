import type { Metadata } from 'next';
import './globals.css';
import GoogleAnalytics, {
  normalizeGoogleAnalyticsId,
} from '@/components/GoogleAnalytics';
import { loadManifest } from '@/lib/content/load-manifest';
import { CONTENT_VERSION } from '@/lib/content/content-version';
import { getTemplate, resolveTemplateId } from '@/lib/templates/registry';
import { themeOverrideStyle } from '@/lib/theme/resolve-theme';
import { ThemeProvider } from '@/components/ThemeProvider';

export function generateMetadata(): Metadata {
  const manifest = loadManifest();
  return {
    title: manifest.config.site.title,
    description: manifest.config.site.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const manifest = loadManifest();
  void CONTENT_VERSION;

  const templateId = resolveTemplateId(manifest);
  const { Shell } = getTemplate(templateId);
  const themeId = manifest.theme;
  const themeStyle = themeOverrideStyle(manifest.config.theme);
  const googleAnalyticsId = normalizeGoogleAnalyticsId(manifest.config.analytics?.google);

  return (
    <html
      lang="en"
      data-template={templateId}
      data-theme={themeId}
      style={themeStyle}
    >
      <body suppressHydrationWarning>
        {googleAnalyticsId ? <GoogleAnalytics measurementId={googleAnalyticsId} /> : null}
        <ThemeProvider themeId={themeId}>
          <Shell manifest={manifest}>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
