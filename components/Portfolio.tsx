'use client';

import { MarkdownBody, slugify, type MarkdownBlockProps } from '@lefolio/engine/markdown';
import { AccentedText } from '../lib/accented';
import { parsePortfolio } from '../lib/parsePortfolio';

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

export default function Portfolio({ content }: MarkdownBlockProps) {
  const { title, intro, items } = parsePortfolio(content);

  return (
    <section
      className="showcase-block showcase-block--alt showcase-portfolio"
      id={slugify(title) || 'portfolio'}
    >
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-portfolio-grid not-prose">
          {items.map((item) => (
            <li key={item.title} className="showcase-portfolio-card">
              {item.images[0] ? (
                <figure className="showcase-portfolio-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images[0].src} alt={item.images[0].alt || ''} />
                </figure>
              ) : null}

              <div className="showcase-portfolio-copy">
                <h3 className="showcase-portfolio-card-title">
                  <AccentedText text={item.title} />
                </h3>
                {item.body ? (
                  <div className="showcase-portfolio-card-body">
                    <MarkdownBody
                      content={item.body}
                      preprocessColumnBlocks={false}
                      preprocessComponentBlocks={false}
                    />
                  </div>
                ) : null}
                {item.actions.length > 0 ? (
                  <div className="showcase-portfolio-card-actions">
                    {item.actions.map((action, index) => (
                      <a
                        key={action.href + action.text}
                        href={action.href}
                        className={
                          index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'
                        }
                        {...(isExternal(action.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {action.text}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
