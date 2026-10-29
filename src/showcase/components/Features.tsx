'use client';

import type { MarkdownBlockProps } from '@lefolio/engine/template';
import { extractListItems, firstHeading, stripHeading } from '@lefolio/engine/parse';

function splitFeature(item: string): { lead: string; text: string } {
  const match = item.match(/^\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/);
  if (match) return { lead: match[1], text: match[2] };
  return { lead: item.replace(/\*\*/g, ''), text: '' };
}

export default function Features({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2);
  const items = extractListItems(stripHeading(content, title)).map(splitFeature);

  return (
    <section className="page-features">
      <div className="showcase-container">
        {title ? <h2 className="page-section-title">{title}</h2> : null}
        <ul className="page-features-list">
          {items.map((item) => (
            <li key={item.lead}>
              <p className="page-feature-lead">{item.lead}</p>
              {item.text ? <p className="page-feature-text">{item.text}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
