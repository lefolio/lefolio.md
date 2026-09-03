'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractFirstImage,
  extractLinks,
  firstHeading,
  paragraphs,
  stripHeading,
  stripImages,
} from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';
import HeroDemoLightbox from '../views/HeroDemoLightbox';

export default function Hero({ content }: MarkdownBlockProps) {
  const image = extractFirstImage(content);
  const title = firstHeading(content, 2);
  const kicker = firstHeading(content, 3);
  let rest = stripImages(stripHeading(content, title));
  rest = stripHeading(rest, kicker);
  const actions = extractLinks(rest);
  const lead = paragraphs(rest).find((block) => !block.startsWith('[')) ?? '';

  return (
    <section className="showcase-hero" id="top">
      <div className="showcase-container showcase-hero-inner">
        <div className="showcase-hero-copy">
          {title ? (
            <h1 className="showcase-hero-title">
              <AccentedText text={title} />
            </h1>
          ) : null}
          {lead ? <p className="showcase-hero-lead">{lead}</p> : null}
          {kicker ? (
            <div className="showcase-hero-kicker">
              <MarkdownBody
                content={kicker}
                preprocessColumnBlocks={false}
                preprocessComponentBlocks={false}
              />
            </div>
          ) : null}
          {actions.length > 0 ? (
            <div className="showcase-hero-actions">
              {actions.map((action, index) => (
                <a
                  key={action.href + action.text}
                  href={action.href}
                  className={index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'}
                  {...(/^https?:/i.test(action.href)
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {action.text}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {image ? (
          <div className="showcase-hero-media">
            <HeroDemoLightbox src={image.src} alt={image.alt || 'lefolio.md live preview'} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
