import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { TemplateStandalonePageProps } from '@/lib/templates/types';

export default function StandalonePageView({ page }: TemplateStandalonePageProps) {
  return (
    <article className="portfolio-container portfolio-page">
      <p className="portfolio-eyebrow">Page</p>
      <h1>{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
