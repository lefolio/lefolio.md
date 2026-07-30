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
    <ul className="mt-8 space-y-4">
      {pages.map((page) => (
        <li key={page.href}>
          <Link href={page.href} className="text-heading text-xl no-underline hover:underline">
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
