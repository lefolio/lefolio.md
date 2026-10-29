'use client';

import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import {
  extractFirstImage,
  firstHeading,
  stripHeading,
  stripImages,
} from '@lefolio/engine/parse';

interface Stat {
  value: string;
  label: string;
}

function splitProseAndStats(markdown: string): { prose: string; stats: Stat[] } {
  const prose: string[] = [];
  const stats: Stat[] = [];
  for (const line of markdown.split('\n')) {
    const stat = line.trim().match(/^(\d[\d,]*)\s+(.+)$/);
    if (stat) {
      stats.push({ value: stat[1], label: stat[2] });
    } else {
      prose.push(line);
    }
  }
  return { prose: prose.join('\n').replace(/\n{3,}/g, '\n\n').trim(), stats };
}

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

/** Links that sit alone on a line are buttons. Links inside a sentence stay in the copy. */
function takeButtonLines(markdown: string): { prose: string; actions: { text: string; href: string }[] } {
  const actions: { text: string; href: string }[] = [];
  const lines = markdown.split('\n').filter((line) => {
    const button = line.trim().match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!button) return true;
    actions.push({ text: button[1], href: button[2] });
    return false;
  });
  return { prose: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), actions };
}

export default function PageHero({ content }: MarkdownBlockProps) {
  const image = extractFirstImage(content);
  const title = firstHeading(content, 1);
  const support = firstHeading(content, 2);
  let rest = stripImages(content);
  rest = stripHeading(rest, title);
  rest = stripHeading(rest, support);
  const { prose: withoutButtons, actions } = takeButtonLines(rest);
  const { prose, stats } = splitProseAndStats(withoutButtons);

  const copy = (
    <div className="page-hero-copy">
      {title ? <h1 className="page-hero-title">{title}</h1> : null}
      {support ? <p className="page-hero-support">{support}</p> : null}
      {prose ? (
        <div className="page-hero-lead">
          <MarkdownBody
            content={prose}
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
              {...(isExternal(action.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {action.text}
            </a>
          ))}
        </div>
      ) : null}
      {stats.length > 0 ? (
        <ul className="page-hero-stats">
          {stats.map((stat) => (
            <li key={stat.value + stat.label}>
              <span className="page-hero-stat-value">{stat.value}</span>
              <span className="page-hero-stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <section className={`page-hero${image ? ' page-hero--split' : ''}`}>
      <div className="showcase-container page-hero-inner">
        {copy}
        {image ? (
          <figure className="page-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt || ''} />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
