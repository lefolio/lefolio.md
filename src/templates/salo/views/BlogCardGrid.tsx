import Link from 'next/link';
import type { SectionListItem } from '@/lib/content/types';

interface BlogCardGridProps {
  pages: SectionListItem[];
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function excerptFor(page: SectionListItem) {
  const preview = page.frontmatter?.preview;
  if (typeof preview === 'string' && preview.trim()) return preview.trim();
  if (page.subtitle) return page.subtitle;
  return null;
}

export default function BlogCardGrid({ pages }: BlogCardGridProps) {
  if (pages.length === 0) {
    return <p className="salo-blog-empty">No posts yet.</p>;
  }

  return (
    <ul className="salo-blog-grid">
      {pages.map((page) => {
        const published = formatDate(page.date);
        const excerpt = excerptFor(page);
        return (
          <li key={page.href} className="salo-blog-card">
            <Link href={page.href} className="salo-blog-card-link">
              <div className="salo-blog-card-media">
                {page.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={page.thumbnail} alt="" className="salo-blog-card-image" />
                ) : (
                  <div className="salo-blog-card-placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="salo-blog-card-body">
                {published ? <time className="salo-blog-card-date">{published}</time> : null}
                <h2 className="salo-blog-card-title">{page.title}</h2>
                {excerpt ? <p className="salo-blog-card-excerpt">{excerpt}</p> : null}
                <span className="salo-blog-card-cta">
                  Read article
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
