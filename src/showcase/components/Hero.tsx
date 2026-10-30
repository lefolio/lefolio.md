'use client';

import { useCallback, useEffect, useState } from 'react';
import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import { AccentedText } from '../lib/accented';
import { parseLefolioHero } from '../lib/parseLefolioHero';

function shotLabel(index: number, alt: string): string {
  if (alt) return alt;
  return index === 0 ? 'Editing in Obsidian' : 'Published site';
}

export default function LefolioHero({ content }: MarkdownBlockProps) {
  const { kicker, title, lead, actions, images } = parseLefolioHero(content);
  const [front, setFront] = useState(() => Math.max(0, images.length - 1));
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox]);

  const active = lightbox !== null ? images[lightbox] : null;

  return (
    <section className="showcase-hero" id="top">
      <div className="showcase-container showcase-hero-inner">
        <div className={`showcase-hero-stage${images.length > 0 ? ' is-media-split' : ''}`}>
          <div className="showcase-hero-rendered">
            <div className="showcase-hero-top">
              <div className="showcase-hero-copy">
                {kicker ? <p className="showcase-hero-kicker">{kicker}</p> : null}
                {title ? (
                  <h1 className="showcase-hero-title">
                    <AccentedText text={title} palette="green" />
                  </h1>
                ) : null}
                {lead ? (
                  <div className="showcase-hero-lead">
                    <MarkdownBody
                      content={lead}
                      preprocessColumnBlocks={false}
                      preprocessComponentBlocks={false}
                    />
                  </div>
                ) : null}
              </div>

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
          </div>

          {images.length > 0 ? (
            <div className="showcase-hero-stack" aria-label="Obsidian edit and published site">
              {images.map((image, index) => {
                const label = shotLabel(index, image.alt);
                const isFront = front === index;
                return (
                  <button
                    key={image.src}
                    type="button"
                    className={`showcase-hero-shot${isFront ? ' is-front' : ''}`}
                    style={{ zIndex: isFront ? 8 : index + 1 }}
                    onMouseEnter={() => setFront(index)}
                    onFocus={() => setFront(index)}
                    onClick={() => setLightbox(index)}
                    aria-label={`Enlarge ${label}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={label} draggable={false} />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {active ? (
        <div
          className="showcase-hero-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={shotLabel(lightbox!, active.alt)}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="showcase-hero-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.src}
            alt={shotLabel(lightbox!, active.alt)}
            className="showcase-hero-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}
