'use client';

import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import { firstHeading, stripHeading } from '@lefolio/engine/parse';
import { AccentedText } from '../lib/accented';

export default function Connect({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || firstHeading(content, 1) || 'Connect';
  const body = stripHeading(content, title);

  return (
    <section className="showcase-block showcase-block--alt" id="connect">
      <div className="showcase-container showcase-connect">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        <div className="showcase-connect-body">
          <MarkdownBody
            content={body}
            preprocessColumnBlocks={false}
            preprocessComponentBlocks={false}
          />
        </div>
      </div>
    </section>
  );
}
