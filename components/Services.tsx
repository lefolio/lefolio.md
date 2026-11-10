'use client';

import { MarkdownBody, slugify, type MarkdownBlockProps } from '@lefolio/engine/markdown';
import { AccentedText } from '../lib/accented';
import { parseServices } from '../lib/parseServices';

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

export default function Services({ content }: MarkdownBlockProps) {
  const { title, intro, items, actions } = parseServices(content);

  return (
    <section
      className="showcase-block showcase-services"
      id={slugify(title) || 'services'}
    >
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ul className="showcase-services-grid not-prose">
          {items.map((item) => (
            <li key={item.title} className="showcase-services-card">
              <h3 className="showcase-services-card-title">
                <AccentedText text={item.title} />
              </h3>
              {item.body ? (
                <div className="showcase-services-card-body">
                  <MarkdownBody
                    content={item.body}
                    preprocessColumnBlocks={false}
                    preprocessComponentBlocks={false}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {actions.length > 0 ? (
          <div className="showcase-services-actions">
            {actions.map((action, index) => (
              <a
                key={action.href + action.text}
                href={action.href}
                className={index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'}
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
    </section>
  );
}
