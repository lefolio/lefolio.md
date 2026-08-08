'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
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

export default function Hero({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const imageSrc = extractFirstImageSrc(prepared);
  const title = firstHeading(prepared, 1);
  const links = extractLinks(prepared);
  const body = stripLinks(stripHeadings(stripImages(prepared)));

  return (
    <section className="salo-hero" data-component="hero">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageSrc} alt="" className="salo-hero-image" />
      ) : null}
      <div className="salo-hero-overlay" aria-hidden="true" />
      <div className="salo-hero-content">
        <div className="salo-container salo-hero-inner">
          {title ? <h1 className="salo-hero-title">{title}</h1> : null}
          {body ? (
            <div className="salo-hero-lead">
              <MarkdownBody
                content={body}
                preprocessColumnBlocks={false}
                preprocessComponentBlocks={false}
              />
            </div>
          ) : null}
          {links.length > 0 ? (
            <div className="salo-hero-actions">
              {links.map((link) => (
                <a
                  key={`${link.href}-${link.text}`}
                  href={link.href}
                  className={
                    link.variant === 'secondary' ? 'salo-btn salo-btn-outline' : 'salo-btn salo-btn-light'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
