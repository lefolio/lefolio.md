'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractAllImages,
  extractLinks,
  firstHeading,
  splitByHeading,
  stripHeading,
  type MdImage,
} from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';
import CompareSwitch from './CompareSlider';

interface ShowcaseItem {
  title: string;
  liveUrl: string | null;
  githubUrl: string | null;
  original: MdImage | null;
  edited: MdImage | null;
}

function extractBareUrls(markdown: string): string[] {
  return markdown.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
}

function parseShowcaseItem(section: { title: string; body: string }): ShowcaseItem {
  const images = extractAllImages(section.body);
  const links = extractLinks(section.body);
  const urls = links.length > 0 ? links.map((link) => link.href) : extractBareUrls(section.body);

  return {
    title: section.title,
    liveUrl: urls[0] ?? null,
    githubUrl: urls[1] ?? null,
    original: images[0] ?? null,
    edited: images[1] ?? images[0] ?? null,
  };
}

function HoverThumb({
  original,
  edited,
  title,
  onOpen,
}: {
  original: MdImage;
  edited: MdImage;
  title: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="showcase-shot"
      onClick={onOpen}
      aria-label={`Compare ${title} original and edited views`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={original.src} alt="" className="showcase-shot-image showcase-shot-image--a" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={edited.src} alt="" className="showcase-shot-image showcase-shot-image--b" />
    </button>
  );
}

export default function Showcase({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Showcase';
  const { intro, sections } = splitByHeading(stripHeading(content, title), 3);
  const items = sections.map(parseShowcaseItem);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex, close]);

  const openItem = openIndex === null ? null : items[openIndex];

  return (
    <section className="showcase-block" id="built-with">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-sites">
          {items.map((item, index) => (
            <li key={item.title} className="showcase-site">
              {item.original && item.edited ? (
                <HoverThumb
                  original={item.original}
                  edited={item.edited}
                  title={item.title}
                  onOpen={() => setOpenIndex(index)}
                />
              ) : null}
              <h3 className="showcase-site-title">{item.title}</h3>
              <div className="showcase-site-actions">
                {item.liveUrl ? (
                  <a
                    href={item.liveUrl}
                    className="showcase-cta-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live site
                  </a>
                ) : null}
                {item.githubUrl ? (
                  <a
                    href={item.githubUrl}
                    className="showcase-cta-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {openItem?.original && openItem.edited ? (
        <div
          className="showcase-compare-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${openItem.title} before and after`}
          onClick={close}
        >
          <button
            type="button"
            className="showcase-hero-lightbox-close"
            onClick={close}
            aria-label="Close comparison"
          >
            ×
          </button>
          <div className="showcase-compare-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <p className="showcase-compare-lightbox-title">{openItem.title}</p>
            <CompareSwitch
              original={openItem.original}
              edited={openItem.edited}
              originalLabel="Website"
              editedLabel="Markdown"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
