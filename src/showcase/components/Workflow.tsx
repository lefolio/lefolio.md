'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import {
  firstHeading,
  splitByHeading,
  stripHeading,
} from '@lefolio/engine/parse';
import { AccentedText } from '../lib/accented';
import { MarkdownHighlight } from '../lib/markdownHighlight';
import LiveMarkdownTransform from './LiveMarkdownTransform';

/** Inline markdown for tab labels (no block elements inside <button>). */
function WorkflowInlineMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }: { children?: ReactNode }) => <>{children}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

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
  const colors = useMemo(
    () => [
      // blue
      ['#4f8cff', '#3b82f6', '#60a5fa', '#2563eb', '#93c5fd'],
      // green
      ['#22e58a', '#34d399', '#10b981', '#6ee7b7', '#059669'],
      // yellow
      ['#ffd60a', '#fbbf24', '#f59e0b', '#fde047', '#eab308'],
    ],
    [],
  );

  type Particle = {
    id: number;
    color: string;
    dx: number;
    dy: number;
    size: number;
    duration: number;
    delay: number;
  };

  const [particles, setParticles] = useState<Particle[]>([]);
  const burstId = useRef(0);

  const spawnParticles = useCallback(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const palette = colors[Math.floor(Math.random() * colors.length)];
    const count = 14 + Math.floor(Math.random() * 8);
    const batchId = burstId.current;
    burstId.current += 1;

    const next: Particle[] = Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.55;
      const distance = 36 + Math.random() * 54;
      return {
        id: batchId * 100 + index,
        color: palette[Math.floor(Math.random() * palette.length)],
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 8 - Math.random() * 18,
        size: 5.5 + Math.random() * 6.5,
        duration: 280 + Math.random() * 180,
        delay: Math.random() * 20,
      };
    });

    setParticles((prev) => [...prev, ...next]);
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((particle) => particle.id < batchId * 100 || particle.id >= (batchId + 1) * 100));
    }, 520);
  }, [colors]);

  return (
    <div className="showcase-workflow-agent" role="group" aria-label="Coding agent prompt">
      <div className="showcase-workflow-agent-bar">
        <span className="showcase-workflow-agent-dot" aria-hidden />
        <span>Agent</span>
      </div>
      <MarkdownHighlight source={code} className="showcase-workflow-agent-prompt" />
      <div className="showcase-workflow-agent-actions">
        <button
          type="button"
          className="showcase-workflow-build"
          onClick={spawnParticles}
          aria-label="Build"
        >
          Build
          <span className="showcase-workflow-build-burst" aria-hidden>
            {particles.map((particle) => (
              <span
                key={particle.id}
                className="showcase-workflow-build-particle"
                style={{
                  background: particle.color,
                  width: particle.size,
                  height: particle.size,
                  ['--dx' as string]: `${particle.dx}px`,
                  ['--dy' as string]: `${particle.dy}px`,
                  animationDuration: `${particle.duration}ms`,
                  animationDelay: `${particle.delay}ms`,
                }}
              />
            ))}
          </span>
        </button>
      </div>
    </div>
  );
}

function WorkflowDemo({ index, code }: { index: number; code: string }) {
  if (!code) {
    return <div className="showcase-workflow-demo-empty">Add a code sample for this step.</div>;
  }

  if (index === 1) return <DemoAgent code={code} />;
  if (index === 2) return <LiveMarkdownTransform key="transform-live" code={code} />;
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

  // Desktop: always one selected tab. Mobile: accordion, collapsed by default (multi-open).
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const current = steps[active] ?? steps[0];

  return (
    <section className="showcase-block" id="workflow">
      <div className="showcase-container">
        <h2 className="showcase-block-title">
          <AccentedText text={title} palette="green" />
        </h2>
        {intro ? (
          <div className="showcase-block-lead showcase-workflow-lead">
            <MarkdownBody
              content={intro}
              preprocessColumnBlocks={false}
              preprocessComponentBlocks={false}
            />
          </div>
        ) : null}

        {/* Desktop: left tabs + right demo */}
        <div className="showcase-workflow showcase-workflow--desktop">
          <div className="showcase-workflow-tabs" role="tablist" aria-label="Workflow steps">
            {steps.map((step, index) => {
              const selected = index === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  id={`workflow-tab-desktop-${index}`}
                  aria-selected={selected}
                  aria-controls="workflow-demo-desktop"
                  className={`showcase-workflow-tab${selected ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <span className="showcase-workflow-tab-copy">
                    <span className="showcase-workflow-title">{step.title}</span>
                    {step.body ? (
                      <span className="showcase-workflow-body">
                        <WorkflowInlineMarkdown content={step.body} />
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="showcase-workflow-demo"
            id="workflow-demo-desktop"
            role="tabpanel"
            aria-labelledby={`workflow-tab-desktop-${active}`}
          >
            {current ? <WorkflowDemo index={active} code={current.code} /> : null}
          </div>
        </div>

        {/* Mobile: collapsible steps, title only */}
        <div className="showcase-workflow showcase-workflow--mobile">
          {steps.map((step, index) => {
            const expanded = open.has(index);
            return (
              <div
                key={step.title}
                className={`showcase-workflow-step${expanded ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  id={`workflow-tab-mobile-${index}`}
                  className={`showcase-workflow-tab${expanded ? ' is-open' : ''}`}
                  aria-expanded={expanded}
                  aria-controls={`workflow-demo-mobile-${index}`}
                  onClick={() => {
                    setOpen((prev) => {
                      const next = new Set(prev);
                      if (next.has(index)) next.delete(index);
                      else next.add(index);
                      return next;
                    });
                  }}
                >
                  <span className="showcase-workflow-tab-copy">
                    <span className="showcase-workflow-title">{step.title}</span>
                  </span>
                  <span className="showcase-workflow-chevron" aria-hidden="true" />
                </button>

                {expanded ? (
                  <div
                    className="showcase-workflow-demo"
                    id={`workflow-demo-mobile-${index}`}
                    aria-labelledby={`workflow-tab-mobile-${index}`}
                  >
                    <WorkflowDemo index={index} code={step.code} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
