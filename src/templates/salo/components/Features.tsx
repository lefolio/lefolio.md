'use client';

import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, prepareSaloMarkdown, splitByHeading } from '../lib/parse';

function Icon({ name }: { name: string }) {
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" className="salo-feature-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
      </svg>
    );
  }
  if (name === 'sunset') {
    return (
      <svg viewBox="0 0 24 24" className="salo-feature-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v8" />
        <path d="m4.93 10.93 1.41 1.41" />
        <path d="M2 18h2" />
        <path d="M20 18h2" />
        <path d="m19.07 10.93-1.41 1.41" />
        <path d="M22 22H2" />
        <path d="m16 6-4 4-4-4" />
        <path d="M16 18a4 4 0 0 0-8 0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="salo-feature-svg" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Features({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const title = firstHeading(prepared, 2) || firstHeading(prepared);
  const withoutTitle = title
    ? prepared.replace(new RegExp(`^#{1,6}\\s+${escapeRegExp(title)}\\s*$`, 'm'), '')
    : prepared;

  const cardStart = withoutTitle.search(/<span class="salo-icon"|###\s+/);
  const lead =
    cardStart > 0
      ? withoutTitle
          .slice(0, cardStart)
          .replace(/^#{1,6}\s+.+$/gm, '')
          .trim()
      : '';

  const cardsRegion = cardStart >= 0 ? withoutTitle.slice(cardStart) : withoutTitle;
  const chunks = cardsRegion.split(/(?=<span class="salo-icon")/).filter((c) => c.trim());
  let cards = chunks
    .map((chunk) => {
      const icon = chunk.match(/data-icon="([^"]+)"/)?.[1]?.toLowerCase() || 'plus';
      const heading = chunk.match(/###\s+(.+)/)?.[1]?.trim();
      if (!heading) return null;
      const description = chunk
        .replace(/<span class="salo-icon"[^>]*><\/span>/g, '')
        .replace(/^###\s+.+$/m, '')
        .trim();
      return { title: heading, description, icon };
    })
    .filter(Boolean) as Array<{ title: string; description: string; icon: string }>;

  if (cards.length === 0) {
    cards = splitByHeading(cardsRegion, 3).map((card) => ({
      title: card.title,
      description: card.body.replace(/<span class="salo-icon"[^>]*><\/span>/g, '').trim(),
      icon: 'plus',
    }));
  }

  return (
    <section className="salo-features" data-component="features">
      <div className="salo-container">
        <div className="salo-features-intro">
          {title ? <h2 className="salo-section-title">{title}</h2> : null}
          {lead ? <p className="salo-section-lead">{lead}</p> : null}
        </div>
        <div className="salo-features-grid">
          {cards.map((card) => (
            <article key={card.title} className="salo-feature-card">
              <div className="salo-feature-icon">
                <Icon name={card.icon} />
              </div>
              <h3 className="salo-feature-title">{card.title}</h3>
              {card.description ? (
                <p className="salo-feature-blurb">{card.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
