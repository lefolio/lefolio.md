import type { ReactNode } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ContentManifest } from '@/lib/content/types';
import BrandName from '../shell/BrandName';
import HeroDemoLightbox from './HeroDemoLightbox';

interface HomeHeroProps {
  manifest: ContentManifest;
}

/** Render `**bold**` spans with the showcase accent color. */
function AccentedDescription({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(
      <strong key={key} className="showcase-hero-accent">
        {match[1]}
      </strong>
    );
    key += 1;
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return <>{nodes}</>;
}

function heroBrandName(homeTitle: string | undefined, siteTitle: string) {
  const title = homeTitle?.trim() || siteTitle;
  if (/\.md$/i.test(title)) return title;
  if (/^lefolio$/i.test(title) && /\.md$/i.test(siteTitle)) return siteTitle;
  return title;
}

export default function HomeHero({ manifest }: HomeHeroProps) {
  const { home, authorAvatar, config } = manifest;
  const github =
    config.author?.links?.github || 'https://github.com/lefolio/lefolio.md';
  const heroMedia = home?.heroImage || authorAvatar;
  const heroIsDemo = Boolean(home?.heroImage);
  const brand = heroBrandName(home?.title, config.site.title);

  if (!home) {
    return (
      <section className="showcase-hero">
        <div className="showcase-container py-20 text-center">
          <BrandName name={brand} as="h1" className="showcase-hero-title" />
          <p className="showcase-hero-description text-muted mx-auto mt-4 max-w-xl">
            Configure <code>home</code> in config.yaml.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="showcase-hero">
        <div className="showcase-container showcase-hero-row py-12 sm:py-16 lg:py-20">
          <div className="showcase-hero-copy">
            <BrandName name={brand} as="h1" className="showcase-hero-title" />
            {config.site.description ? (
              <p className="showcase-hero-description mt-5 max-w-2xl">
                <AccentedDescription text={config.site.description} />
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={github}
                className="showcase-cta-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fork it on GitHub
              </a>
            </div>
          </div>
          {heroMedia ? (
            <div className="showcase-hero-media">
              {heroIsDemo ? (
                <HeroDemoLightbox
                  src={heroMedia}
                  alt={`${config.site.title} live update demo`}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroMedia}
                  alt={config.site.title}
                  className="showcase-hero-logo"
                />
              )}
            </div>
          ) : null}
        </div>
      </section>
      {home.processedBody ? (
        <section className="showcase-container showcase-home-body pb-20">
          <MarkdownRenderer content={home.processedBody} />
        </section>
      ) : null}
    </>
  );
}
