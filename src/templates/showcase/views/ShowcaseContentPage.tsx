import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ManifestPage } from '@/lib/content/types';

interface ShowcaseContentPageProps {
  page: ManifestPage;
}

function externalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export default function ShowcaseContentPage({ page }: ShowcaseContentPageProps) {
  const liveUrl = externalUrl(page.frontmatter?.live_url);
  const githubUrl = externalUrl(page.frontmatter?.github_url);
  const subtitle =
    typeof page.frontmatter?.subtitle === 'string' ? page.frontmatter.subtitle.trim() : '';
  const hasLinks = Boolean(liveUrl || githubUrl);

  return (
    <article>
      <p className="text-muted mb-2 text-sm uppercase tracking-wide">{page.section}</p>
      <h1 className={`text-heading text-3xl font-bold ${hasLinks || subtitle ? 'mb-4' : 'mb-6'}`}>
        {page.title}
      </h1>
      {subtitle ? (
        <p className="text-muted mb-4 text-lg leading-relaxed">{subtitle}</p>
      ) : null}
      {hasLinks ? (
        <div className="mb-8 flex flex-wrap gap-3">
          {liveUrl ? (
            <a
              href={liveUrl}
              className="showcase-cta-primary"
              target="_blank"
              rel="noreferrer"
            >
              Live demo
            </a>
          ) : null}
          {githubUrl ? (
            <a
              href={githubUrl}
              className="showcase-cta-secondary"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          ) : null}
        </div>
      ) : null}
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
