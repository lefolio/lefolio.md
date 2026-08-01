import Link from 'next/link';
import type { SectionListItem } from '@/lib/content/types';

interface SectionPageListProps {
  pages: SectionListItem[];
  display?: string;
}

export default function SectionPageList({ pages }: SectionPageListProps) {
  if (pages.length === 0) {
    return <p className="text-muted">No pages in this section yet.</p>;
  }

  return (
    <ul className="portfolio-entry-list">
      {pages.map((page) => (
        <li key={page.href}>
          <Link href={page.href}>
            <h2>{page.title}</h2>
            {page.subtitle ? <p className="portfolio-meta">{page.subtitle}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
