'use client';

import type { ReactNode } from 'react';
import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/markdown';
import {
  extractFirstImage,
  extractStandaloneActions,
  firstHeading,
  stripHeading,
  stripImages,
} from '@lefolio/engine/markdown';
import { AccentedText } from '../lib/accented';

interface Stat {
  value: string;
  label: string;
}

/** Render inline `[text](url)` links inside otherwise plain stat labels. */
function renderInlineLinks(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const href = match[2];
    nodes.push(
      <a
        key={`link-${key++}`}
        href={href}
        {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length === 1 ? nodes[0] : nodes;
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

interface HeroQuote {
  text: string;
  attribution: string | null;
}

/** Pull markdown blockquotes out of the body for the hero aside. */
function takeBlockquotes(markdown: string): { prose: string; quotes: HeroQuote[] } {
  const prose: string[] = [];
  const quotes: HeroQuote[] = [];
  let quoteLines: string[] = [];

  const flush = () => {
    if (quoteLines.length === 0) return;
    const raw = quoteLines
      .map((line) => line.replace(/^>\s?/, ''))
      .join('\n')
      .trim();
    quoteLines = [];
    if (!raw) return;
    const attributed = raw.match(/^["“]?([\s\S]*?)["”]?\s*[—–-]\s*(.+)$/);
    if (attributed) {
      quotes.push({
        text: attributed[1].replace(/^["“]|["”]$/g, '').trim(),
        attribution: attributed[2].trim(),
      });
      return;
    }
    quotes.push({
      text: raw.replace(/^["“]|["”]$/g, '').trim(),
      attribution: null,
    });
  };

  for (const line of markdown.split('\n')) {
    if (/^>\s?/.test(line)) {
      quoteLines.push(line);
      continue;
    }
    flush();
    prose.push(line);
  }
  flush();

  return {
    prose: prose.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    quotes,
  };
}

export default function PageHero({ content }: MarkdownBlockProps) {
  const image = extractFirstImage(content);
  const title = firstHeading(content, 1);
  const support = firstHeading(content, 2);
  let rest = stripImages(content);
  rest = stripHeading(rest, title);
  rest = stripHeading(rest, support);
  const { prose: withoutButtons, actions } = extractStandaloneActions(rest);
  const { prose: withoutQuotes, quotes } = takeBlockquotes(withoutButtons);
  const { prose, stats } = splitProseAndStats(withoutQuotes);
  const quote = quotes[0] ?? null;
  const split = Boolean(quote || image);

  const copy = (
    <div className="page-hero-copy">
      {title ? (
        <h1 className="page-hero-title">
          <AccentedText text={title} palette="purple" />
        </h1>
      ) : null}
      {support ? (
        <p className="page-hero-support">
          <AccentedText text={support} palette="purple" />
        </p>
      ) : null}
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
              <span className="page-hero-stat-label">{renderInlineLinks(stat.label)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <section className={`page-hero${split ? ' page-hero--split' : ''}`}>
      <div className="showcase-container page-hero-inner">
        {copy}
        {quote ? (
          <blockquote className="page-hero-quote">
            <p className="page-hero-quote-text">“{quote.text}”</p>
            {quote.attribution ? (
              <footer className="page-hero-quote-attribution">— {quote.attribution}</footer>
            ) : null}
          </blockquote>
        ) : image ? (
          <figure className="page-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt || ''} />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
