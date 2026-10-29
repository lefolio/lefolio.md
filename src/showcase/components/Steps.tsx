'use client';

import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import { extractListItems, firstHeading } from '@lefolio/engine/parse';

export default function Steps({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2);
  const items = extractListItems(content);

  return (
    <section className="page-steps">
      <div className="showcase-container">
        {title ? <h2 className="page-section-title">{title}</h2> : null}
        <ol className="page-steps-list">
          {items.map((item) => (
            <li key={item}>
              <MarkdownBody
                content={item}
                preprocessColumnBlocks={false}
                preprocessComponentBlocks={false}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
