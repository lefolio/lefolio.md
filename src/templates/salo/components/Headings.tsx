'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, prepareSaloMarkdown, stripHeadings } from '../lib/parse';

/** Eyebrow + heading + lead for a section intro. */
export default function Headings({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const lines = prepared.split('\n').map((l) => l.trim()).filter(Boolean);
  const heading = firstHeading(prepared);
  const eyebrow = lines.find((l) => !l.startsWith('#')) ?? null;
  const body = stripHeadings(prepared);
  // Drop eyebrow line from body if it was the first plain line
  const lead = eyebrow && body.startsWith(eyebrow)
    ? body.slice(eyebrow.length).trim()
    : body;

  return (
    <section className="salo-headings" data-component="headings">
      <div className="salo-container salo-headings-inner">
        {eyebrow && eyebrow !== heading ? (
          <p className="salo-eyebrow">{eyebrow}</p>
        ) : null}
        {heading ? <h2 className="salo-section-title">{heading}</h2> : null}
        {lead ? (
          <div className="salo-section-lead">
            <MarkdownBody
              content={lead}
              preprocessColumnBlocks={false}
              preprocessComponentBlocks={false}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
