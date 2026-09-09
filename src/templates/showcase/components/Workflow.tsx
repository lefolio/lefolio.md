'use client';

import { useMemo, useState } from 'react';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import {
  extractLinks,
  firstHeading,
  splitByHeading,
  stripHeading,
  stripHeadings,
  stripLinks,
} from '@/lib/markdown/parse';
import { AccentedText } from '../lib/accented';
import { MarkdownHighlight } from '../lib/markdownHighlight';

interface WorkflowStep {
  title: string;
  body: string;
  code: string;
}

function extractFencedCode(markdown: string): { prose: string; code: string } {
  const match = markdown.match(/```[^\n]*\r?\n([\s\S]*?)```/);
  if (!match || match.index === undefined) {
    return { prose: markdown.trim(), code: '' };
  }

  const prose = `${markdown.slice(0, match.index)}${markdown.slice(match.index + match[0].length)}`
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    prose,
    code: match[1].replace(/^\n+/, '').replace(/\n+$/, ''),
  };
}

function DemoMarkdown({ code }: { code: string }) {
  return (
    <div className="showcase-workflow-demo-panel">
      <div className="showcase-workflow-demo-chrome" aria-hidden>
        <span />
        <span />
        <span />
        <em>Home.md</em>
      </div>
      <MarkdownHighlight source={code} className="showcase-workflow-code" />
    </div>
  );
}

function DemoAgent({ code }: { code: string }) {
  return (
    <div className="showcase-workflow-agent" role="group" aria-label="Coding agent prompt">
      <div className="showcase-workflow-agent-bar">
        <span className="showcase-workflow-agent-dot" aria-hidden />
        <span>Agent</span>
        <span className="showcase-workflow-agent-model">Claude · Cursor</span>
      </div>
      <pre className="showcase-workflow-agent-prompt">
        <code>{code}</code>
      </pre>
      <div className="showcase-workflow-agent-actions">
        <button type="button" className="showcase-workflow-build" tabIndex={-1}>
          Build
        </button>
      </div>
    </div>
  );
}

function DemoTransform({ code }: { code: string }) {
  const cleaned = code
    .split('\n')
    .filter((line) => !/^:::/.test(line.trim()))
    .join('\n');
  const brand = firstHeading(cleaned, 2) ?? 'My Brand';
  const kicker = firstHeading(stripHeading(cleaned, brand), 3);
  const links = extractLinks(cleaned);
  const rest = stripLinks(stripHeadings(cleaned)).trim();

  return (
    <div className="showcase-workflow-transform">
      <div className="showcase-workflow-transform-source">
        <MarkdownHighlight source={code} className="showcase-workflow-code is-compact" />
      </div>
      <div className="showcase-workflow-transform-arrow" aria-hidden>
        →
      </div>
      <div className="showcase-workflow-transform-result">
        <div className="showcase-workflow-preview">
          <p className="showcase-workflow-preview-brand">{brand}</p>
          {kicker ? <h4 className="showcase-workflow-preview-title">{kicker}</h4> : null}
          {rest ? <p className="showcase-workflow-preview-body">{rest}</p> : null}
          {links.length > 0 ? (
            <div className="showcase-workflow-preview-actions">
              {links.map((link, index) => (
                <span
                  key={`${link.href}-${link.text}`}
                  className={
                    index === 0
                      ? 'showcase-workflow-preview-btn is-primary'
                      : 'showcase-workflow-preview-btn'
                  }
                >
                  {link.text}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WorkflowDemo({ index, code }: { index: number; code: string }) {
  if (!code) {
    return <div className="showcase-workflow-demo-empty">Add a code sample for this step.</div>;
  }

  if (index === 1) return <DemoAgent code={code} />;
  if (index === 2) return <DemoTransform code={code} />;
  return <DemoMarkdown code={code} />;
}

export default function Workflow({ content }: MarkdownBlockProps) {
  const title = firstHeading(content, 2) || 'Workflow';

  const { intro, steps } = useMemo(() => {
    const split = splitByHeading(stripHeading(content, title), 4);
    return {
      intro: split.intro,
      steps: split.sections.map((section) => {
        const { prose, code } = extractFencedCode(section.body);
        return { title: section.title, body: prose, code };
      }),
    };
  }, [content, title]);

  const [active, setActive] = useState(0);
  const current = steps[active] ?? steps[0];

  return (
    <section className="showcase-block" id="workflow">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} />
        </h2>
        {intro ? <p className="showcase-block-lead">{intro}</p> : null}

        <div className="showcase-workflow">
          <div className="showcase-workflow-tabs" role="tablist" aria-label="Workflow steps">
            {steps.map((step, index) => {
              const selected = index === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  id={`workflow-tab-${index}`}
                  aria-selected={selected}
                  aria-controls="workflow-demo"
                  className={`showcase-workflow-tab${selected ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <span className="showcase-workflow-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="showcase-workflow-tab-copy">
                    <span className="showcase-workflow-title">{step.title}</span>
                    {step.body ? <span className="showcase-workflow-body">{step.body}</span> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="showcase-workflow-demo"
            id="workflow-demo"
            role="tabpanel"
            aria-labelledby={`workflow-tab-${active}`}
          >
            {current ? <WorkflowDemo index={active} code={current.code} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
