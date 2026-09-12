import { MarkdownBody } from '@lefolio/engine/markdown';
import type { ContentManifest } from '@lefolio/engine/template';

interface HomeHeroProps {
  manifest: ContentManifest;
}

export default function HomeHero({ manifest }: HomeHeroProps) {
  const body = manifest.home?.processedBody;

  if (!body) {
    return (
      <section className="showcase-hero">
        <div className="showcase-container py-20 text-center">
          <h1 className="showcase-hero-title">{manifest.config.site.title}</h1>
          <p className="showcase-hero-lead">
            Configure <code>home</code> in config.yaml.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="showcase-home">
      <MarkdownBody content={body} />
    </div>
  );
}
