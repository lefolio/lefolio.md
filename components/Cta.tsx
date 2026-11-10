'use client';

import { MarkdownBody, type MarkdownBlockProps } from '@lefolio/engine/markdown';
import { AccentedText } from '../lib/accented';
import { parseCta } from '../lib/parseCta';

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

export default function Cta({ content }: MarkdownBlockProps) {
  const { title, body, actions } = parseCta(content);

  return (
    <section className="showcase-block showcase-block--alt showcase-cta" id="cta">
      <div className="showcase-container showcase-cta-inner">
        {title ? (
          <h2 className="showcase-cta-title">
            <AccentedText text={title} />
          </h2>
        ) : null}
        {body ? (
          <div className="showcase-cta-body">
            <MarkdownBody
              content={body}
              preprocessColumnBlocks={false}
              preprocessComponentBlocks={false}
            />
          </div>
        ) : null}
        {actions.length > 0 ? (
          <div className="showcase-cta-actions">
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
