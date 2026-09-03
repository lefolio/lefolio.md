'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, stripHeading } from '@/lib/markdown/parse';
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
