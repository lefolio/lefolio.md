import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { TemplateSectionIndexProps } from '@/lib/templates/types';
import BlogCardGrid from './BlogCardGrid';

export default function SectionIndex({ section }: TemplateSectionIndexProps) {
  const title = section.index?.title || section.name;

  return (
    <div className="salo-section salo-blog-index">
      <header className="salo-section-header">
        <div className="salo-container">
          <h1 className="salo-section-title">{title}</h1>
          {section.index?.processedBody ? (
            <div className="salo-section-intro">
              <MarkdownRenderer content={section.index.processedBody} />
            </div>
          ) : (
            <p className="salo-section-lead">Pages in this section.</p>
          )}
        </div>
      </header>

      <div className="salo-container salo-section-body">
        <BlogCardGrid pages={section.pages} />
      </div>
    </div>
  );
}
