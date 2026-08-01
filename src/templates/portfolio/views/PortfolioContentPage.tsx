import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ManifestPage } from '@/lib/content/types';

interface PortfolioContentPageProps {
  page: ManifestPage;
}

export default function PortfolioContentPage({ page }: PortfolioContentPageProps) {
  return (
    <article className="portfolio-container portfolio-page">
      <p className="portfolio-eyebrow">{page.section}</p>
      <h1>{page.title}</h1>
      {page.frontmatter?.subtitle ? (
        <p className="portfolio-meta" style={{ marginBottom: '1.5rem' }}>
          {String(page.frontmatter.subtitle)}
        </p>
      ) : null}
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
