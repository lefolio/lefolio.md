'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractFirstImageSrc,
  extractLinks,
  firstHeading,
  prepareSaloMarkdown,
  stripImages,
  stripLinks,
} from '../lib/parse';

export default function About({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const imageSrc = extractFirstImageSrc(prepared);
  const title = firstHeading(prepared, 2) || firstHeading(prepared);
  const links = extractLinks(prepared);
  let body = stripImages(prepared);
  if (title) {
    body = body.replace(
      new RegExp(`^#{1,6}\\s+${title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*$`, 'm'),
      '',
    );
  }
  body = stripLinks(body);

  return (
    <section className="salo-about" data-component="about">
      <div className="salo-container salo-about-grid">
        <div className="salo-about-media">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="" className="salo-about-image" />
          ) : null}
        </div>
        <div className="salo-about-copy">
          {title ? <h2 className="salo-section-title">{title}</h2> : null}
          <div className="salo-about-body">
            <MarkdownBody content={body.trim()} preprocessColumnBlocks={false} />
          </div>
          {links[0] ? (
            <a
              href={links[0].href}
              className="salo-btn salo-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {links[0].text}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
