'use client';

import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/markdown';
import {
  extractFirstImage,
  extractStandaloneActions,
  firstHeading,
  stripHeading,
  stripImages,
} from '@lefolio/engine/markdown';

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

/** True when the first image appears before body copy (title/links ignored). */
function imageComesBeforeText(markdown: string): boolean {
  const match = markdown.match(/!\[[^\]]*\]\([^)]+\)|<img\b|<figure\b/i);
  if (!match || match.index == null) return false;
  const before = markdown
    .slice(0, match.index)
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/^\s*\[[^\]]+\]\([^)]+\)\s*$/gm, '')
    .trim();
  return before.length === 0;
}

function ExternalIcon() {
  return (
    <svg
      className="page-split-ext-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"
      />
    </svg>
  );
}

export default function Split({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2);
  const image = extractFirstImage(content);
  const mediaLeft = Boolean(image && imageComesBeforeText(stripHeading(content, title)));
  const { prose: rest, actions } = extractStandaloneActions(
    stripImages(stripHeading(content, title)),
  );

  const copy = (
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
        <div className="page-split-links">
          {actions.map((action) => {
            const external = isExternal(action.href);
            return (
              <a
                key={action.href + action.text}
                href={action.href}
                className="page-split-link"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="page-split-link-text">{action.text}</span>
                {external ? <ExternalIcon /> : null}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  const media = image ? (
    <figure className="page-split-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt || ''} />
    </figure>
  ) : null;

  return (
    <section className="page-split">
      <div
        className={[
          'showcase-container',
          'page-split-inner',
          image ? '' : 'is-text',
          mediaLeft ? 'is-media-left' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {mediaLeft ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </section>
  );
}
