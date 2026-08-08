'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractFirstImageSrc,
  extractLinks,
  firstHeading,
  prepareSaloMarkdown,
  stripHeadings,
  stripImages,
  stripLinks,
} from '../lib/parse';

export default function Promo({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const imageSrc = extractFirstImageSrc(prepared);
  const title = firstHeading(prepared, 2) || firstHeading(prepared);
  const link = extractLinks(prepared)[0];
  const body = stripLinks(stripHeadings(stripImages(prepared)));

  return (
    <section className="salo-promo" data-component="promo">
      <div className="salo-container salo-promo-grid">
        <div className="salo-promo-copy">
          {title ? <h2 className="salo-promo-title">{title}</h2> : null}
          {body ? <p className="salo-promo-lead">{body}</p> : null}
          {link ? (
            <a
              href={link.href}
              className="salo-btn salo-btn-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </a>
          ) : null}
        </div>
        <div className="salo-promo-media">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="" className="salo-promo-image" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
