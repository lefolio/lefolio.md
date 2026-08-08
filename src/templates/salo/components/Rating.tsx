'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';

/** Compact star rating line, e.g. `4.3 · 34 reviews`. */
export default function Rating({ content }: MarkdownBlockProps) {
  const text = content.trim();
  if (!text) return null;

  const scoreMatch = text.match(/([\d.]+)/);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;
  const filled = score != null && !Number.isNaN(score) ? Math.round(score) : 4;

  return (
    <div className="salo-rating" data-component="rating" aria-label={text}>
      <span className="salo-rating-stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < filled ? 'is-filled' : 'is-empty'}>
            ★
          </span>
        ))}
      </span>
      <span className="salo-rating-text">{text}</span>
    </div>
  );
}
