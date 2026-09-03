'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { extractListItems, firstHeading, stripHeading, stripList } from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';

export default function Tools({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Tools';
  const items = extractListItems(content);
  const intro = stripList(stripHeading(content, title));

  return (
    <section className="showcase-block showcase-block--alt" id="tools">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-tools">
          {items.map((item, index) => (
            <li key={item} className="showcase-tool">
              <span className="showcase-tool-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="showcase-tool-body">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
