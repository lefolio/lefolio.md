'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import { parseTestimonials } from '@/lib/markdown/parse-testimonials';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';

export default function Testimonials({ content }: MarkdownBlockProps) {
  const items = parseTestimonials(content);

  if (items.length === 0) return null;

  return (
    <section
      className="portfolio-testimonials"
      data-component="testimonials"
      aria-label="Testimonials"
    >
      <ul className="portfolio-testimonials-list">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="portfolio-testimonial">
            {item.bodyMarkdown ? (
              <div className="portfolio-testimonial-quote">
                <MarkdownBody
                  content={item.bodyMarkdown}
                  preprocessColumnBlocks={false}
                  preprocessComponentBlocks={false}
                />
              </div>
            ) : null}
            <footer className="portfolio-testimonial-meta">
              {item.name ? (
                <cite className="portfolio-testimonial-name">{item.name}</cite>
              ) : null}
              {item.title ? (
                <span className="portfolio-testimonial-title">{item.title}</span>
              ) : null}
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
