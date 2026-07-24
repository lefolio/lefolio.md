import Link from 'next/link';
import type { SectionListItem } from '@/lib/content/types';

interface SectionPageListProps {
  pages: SectionListItem[];
  display?: string;
}

function externalUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function TemplateGrid({ pages }: { pages: SectionListItem[] }) {
  return (
    <ul className="showcase-template-grid mt-10">
      {pages.map((page) => {
        const liveUrl = externalUrl(page.frontmatter?.live_url);
        const githubUrl = externalUrl(page.frontmatter?.github_url);

        return (
          <li key={page.href} className="showcase-template-card">
            <Link href={page.href} className="group block no-underline">
              <div className="showcase-template-shot">
                {page.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={page.thumbnail}
                    alt=""
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                ) : (
                  <div className="showcase-template-shot-empty">
                    <span>Coming soon</span>
                  </div>
                )}
              </div>
              <h2 className="text-heading mt-4 text-2xl font-semibold tracking-tight group-hover:underline">
                {page.title}
              </h2>
              {page.subtitle ? (
                <p className="text-muted mt-1 text-base leading-relaxed">{page.subtitle}</p>
              ) : null}
            </Link>

            {(liveUrl || githubUrl) && (
              <div className="mt-4 flex flex-wrap gap-3">
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
            )}
          </li>
        );
      })}
    </ul>
  );
}

function DocList({ pages }: { pages: SectionListItem[] }) {
  return (
    <ul className="showcase-doc-list divide-y">
      {pages.map((page) => (
        <li key={page.href} className="py-5">
          <Link href={page.href} className="group block no-underline">
            <h2 className="text-heading text-xl font-semibold group-hover:underline">
              {page.title}
            </h2>
            {page.subtitle ? <p className="text-muted mt-1">{page.subtitle}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SectionPageList({ pages, display }: SectionPageListProps) {
  if (pages.length === 0) {
    return <p className="text-muted">No pages in this section yet.</p>;
  }

  if (display === 'grid') {
    return <TemplateGrid pages={pages} />;
  }

  return <DocList pages={pages} />;
}
