import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { TemplateSectionIndexProps } from '@/lib/templates/types';
import SectionPageList from './SectionPageList';

export default function SectionIndex({ manifest, section }: TemplateSectionIndexProps) {
  const title = section.index?.title || section.name;
  const showDefaultIntro = !section.index?.processedBody;

  return (
    <article>
      <h1 className="text-heading mb-2 text-3xl font-bold">{title}</h1>

      {section.index?.processedBody ? (
        <div className="mb-2">
          <MarkdownRenderer content={section.index.processedBody} />
        </div>
      ) : null}

      {showDefaultIntro ? (
        <p className="text-muted mb-8">Pages in this section.</p>
      ) : null}

      <SectionPageList
        display={section.display}
        pages={section.pages}
        highlightAuthor={manifest.config.author?.name}
      />
    </article>
  );
}
