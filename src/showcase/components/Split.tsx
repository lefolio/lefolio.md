'use client';

import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import {
  extractFirstImage,
  extractLinks,
  firstHeading,
  stripHeading,
  stripImages,
  stripLinks,
} from '@lefolio/engine/parse';

export default function Split({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2);
  const image = extractFirstImage(content);
  let rest = stripImages(stripHeading(content, title));
  const actions = extractLinks(rest);
  rest = stripLinks(rest).trim();

  return (
    <section className="page-split">
      <div className={`showcase-container page-split-inner${image ? '' : ' is-text'}`}>
        <div className="page-split-copy">
          {title ? <h2 className="page-section-title">{title}</h2> : null}
          {rest ? (
            <div className="page-split-body">
              <MarkdownBody
                content={rest}
                preprocessColumnBlocks={false}
                preprocessComponentBlocks={false}
              />
            </div>
          ) : null}
          {actions.length > 0 ? (
            <div className="page-hero-actions">
              {actions.map((action, index) => (
                <a
                  key={action.href + action.text}
                  href={action.href}
                  className={index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'}
                >
                  {action.text}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        {image ? (
          <figure className="page-split-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt || ''} />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
