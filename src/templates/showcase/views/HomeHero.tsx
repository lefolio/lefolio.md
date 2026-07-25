import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ContentManifest } from '@/lib/content/types';

interface HomeHeroProps {
  manifest: ContentManifest;
}

export default function HomeHero({ manifest }: HomeHeroProps) {
  const { home, authorAvatar, config } = manifest;
  const github =
    config.author?.links?.github || 'https://github.com/oilandrust/lefolio-academic';
  const docsHref =
    manifest.navigation.find((item) => /docs/i.test(item.label))?.href || '/Docs/';
  const heroMedia = home?.heroImage || authorAvatar;
  const heroIsDemo = Boolean(home?.heroImage);

  if (!home) {
    return (
      <section className="showcase-hero">
        <div className="showcase-container py-20 text-center">
          <h1 className="text-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            {config.site.title}
          </h1>
          <p className="text-muted mx-auto mt-4 max-w-xl text-lg">
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
          {heroMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroMedia}
              alt={heroIsDemo ? `${config.site.title} live update demo` : config.site.title}
              className={heroIsDemo ? 'showcase-hero-demo' : 'showcase-hero-logo'}
            />
          ) : null}
          <div className="showcase-hero-copy">
            <h1 className="text-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {home.title}
            </h1>
            {config.site.description ? (
              <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed sm:text-xl">
                {config.site.description}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={github}
                className="showcase-cta-primary"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
              <Link href={docsHref} className="showcase-cta-secondary">
                Documentation
              </Link>
            </div>
          </div>
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
