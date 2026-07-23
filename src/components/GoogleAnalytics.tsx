import Script from 'next/script';

/** GA4 measurement IDs look like G-XXXXXXXXXX */
const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i;

export function normalizeGoogleAnalyticsId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  return GA_MEASUREMENT_ID.test(id) ? id : null;
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

/** Core GA4 loader — template-agnostic; only render when a valid id is configured. */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const id = normalizeGoogleAnalyticsId(measurementId);
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="lefolio-google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
