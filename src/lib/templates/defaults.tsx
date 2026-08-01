import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type {
  TemplateContentPageProps,
  TemplateHomeProps,
  TemplateSectionIndexProps,
  TemplateStandalonePageProps,
} from '@/lib/templates/types';

export function DefaultHome({ manifest }: TemplateHomeProps) {
  const home = manifest.home;

  if (!home) {
    return (
      <article>
        <h1 className="text-heading mb-6 text-3xl font-bold">Home</h1>
        <p className="text-muted">Configure `home` in config.yaml.</p>
      </article>
    );
  }

  return (
    <article>
      <h1 className="text-heading mb-6 text-3xl font-bold">{home.title}</h1>
      <MarkdownRenderer content={home.processedBody} />
    </article>
  );
}

export function DefaultStandalonePage({ page }: TemplateStandalonePageProps) {
  return (
    <article>
      <h1 className="text-heading mb-6 text-3xl font-bold">{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}

export function DefaultSectionIndex({ section }: TemplateSectionIndexProps) {
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

      <ul className="space-y-2">
        {section.pages.map((page) => (
          <li key={page.href}>
            <Link className="link-primary" href={page.href}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function DefaultContentPage({ page }: TemplateContentPageProps) {
  return (
    <article>
      <p className="text-muted mb-2 text-sm uppercase tracking-wide">{page.section}</p>
      <h1 className="text-heading mb-6 text-3xl font-bold">{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
