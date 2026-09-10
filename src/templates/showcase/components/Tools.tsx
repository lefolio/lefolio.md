'use client';

import type { ReactNode } from 'react';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractLinks,
  extractListItems,
  firstHeading,
  stripHeading,
  stripLinks,
  stripList,
} from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';

function AgentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8V4H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M2 14h2M20 14h2M9 13v2M15 13v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ObsidianIcon() {
  return (
    <svg viewBox="0 0 200 240" aria-hidden="true">
      <path
        fill="#9B7EED"
        d="M101 10c28 8 58 40 70 82 14 48 8 92-18 124-18-22-36-58-42-92 4-42 2-84-10-114Z"
      />
      <path
        fill="#D4C4FC"
        d="M101 10C78 30 54 58 40 90c-10 22-8 42 2 56 22-12 46-14 62-24 6-40 8-82-3-112Z"
      />
      <path
        fill="#6B3AD4"
        d="M42 146c-16 10-24 34-14 56 10 24 34 34 56 24 16-30 28-52 34-80-16-10-44-10-76 0Z"
      />
      <path
        fill="#7C5CE8"
        d="M104 146c6 38 24 70 42 92-30 18-70 10-90-22 16-28 28-50 34-70 6 2 10 0 14 0Z"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 8.973L9.219 8.2H8.22v7.783h.996v-6.265l9.45 12.26zm-3.332-8.533 1.37-1.98V8.2h-1.37v5.245z" />
    </svg>
  );
}

const TOOL_LABELS = ['AI coding agent', 'Obsidian', 'Next.js'];

function iconFor(index: number): ReactNode {
  if (index === 1) return <ObsidianIcon />;
  if (index === 2) return <NextIcon />;
  return <AgentIcon />;
}

export default function Tools({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Tools';
  const items = extractListItems(content);
  const actions = extractLinks(content);
  const intro = stripLinks(stripList(stripHeading(content, title)));

  return (
    <section className="showcase-block showcase-block--alt" id="tools">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <div className="showcase-tools-layout">
          <div className="showcase-tools-copy">
            <ul className="showcase-tools">
              {items.map((item, index) => (
                <li key={item} className="showcase-tool">
                  <span className="showcase-tool-icon" aria-hidden="true" title={TOOL_LABELS[index]}>
                    {iconFor(index)}
                  </span>
                  <p className="showcase-tool-body">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {actions.length > 0 ? (
            <div className="showcase-tools-actions">
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
    </section>
  );
}
