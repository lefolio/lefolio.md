'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, splitByHeading, stripHeading } from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';

export default function Workflow({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Workflow';
  const { intro, sections } = splitByHeading(stripHeading(content, title), 4);

  return (
    <section className="showcase-block" id="workflow">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <ol className="showcase-workflow">
          {sections.map((step, index) => (
            <li key={step.title} className="showcase-workflow-step">
              <span className="showcase-workflow-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="showcase-workflow-title">{step.title}</h3>
              {step.body ? (
                <div className="showcase-workflow-body">
                  <MarkdownBody
                    content={step.body}
                    preprocessColumnBlocks={false}
                    preprocessComponentBlocks={false}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
