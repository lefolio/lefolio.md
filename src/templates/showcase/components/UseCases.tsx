'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, splitByHeading, stripHeading } from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';

export default function UseCases({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Use cases';
  const { intro, sections } = splitByHeading(stripHeading(content, title), 4);

  return (
    <section className="showcase-block showcase-block--alt" id="use-cases">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-usecases">
          {sections.map((item) => (
            <li key={item.title} className="showcase-usecase">
              <h3 className="showcase-usecase-title">{item.title}</h3>
              {item.body ? <p className="showcase-usecase-body">{item.body}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
