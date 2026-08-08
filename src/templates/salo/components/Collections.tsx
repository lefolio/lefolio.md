'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractFirstImageSrc,
  extractLinks,
  prepareSaloMarkdown,
  splitByHeading,
  stripImages,
  stripLinks,
} from '../lib/parse';

export default function Collections({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const cards = splitByHeading(prepared, 3);

  if (cards.length === 0) return null;

  return (
    <section className="salo-collections" data-component="collections">
      <div className="salo-container">
        <div className="salo-collections-grid">
          {cards.map((card) => {
            const imageSrc = extractFirstImageSrc(card.body);
            const link = extractLinks(card.body)[0];
            const blurb = stripLinks(stripImages(card.body));
            return (
              <article key={card.title} className="salo-collection-card">
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc} alt="" className="salo-collection-image" />
                ) : null}
                <div className="salo-collection-overlay" aria-hidden="true" />
                <div className="salo-collection-body">
                  <h3 className="salo-collection-title">{card.title}</h3>
                  {blurb ? <p className="salo-collection-blurb">{blurb}</p> : null}
                  {link ? (
                    <a
                      href={link.href}
                      className="salo-collection-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text}
                      <span aria-hidden="true"> →</span>
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
