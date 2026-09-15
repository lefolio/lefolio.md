'use client';

import { useEffect, useRef, useState } from 'react';
import {
  extractLinks,
  firstHeading,
  stripHeadings,
  stripLinks,
} from '@lefolio/engine/parse';
import { MarkdownHighlight } from '../lib/markdownHighlight';

interface LiveMarkdownTransformProps {
  code: string;
  /** When false, run one edit cycle then call onComplete. Default true. */
  loop?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * Side-by-side markdown + live preview that edits
 * "we care about" → "you care about".
 */
export default function LiveMarkdownTransform({
  code,
  loop = true,
  onComplete,
  className = '',
}: LiveMarkdownTransformProps) {
  const prefix = 'We build stuff that ';
  const fromTail = 'we care about';
  const toTail = 'you care about';

  const [tail, setTail] = useState(fromTail);
  const [editing, setEditing] = useState(false);
  const [caretOn, setCaretOn] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTail(toTail);
      setEditing(false);
      onCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const runCycle = async () => {
      setTail(fromTail);
      setEditing(false);
      await wait(1400);
      if (cancelled) return;

      setEditing(true);
      for (let i = fromTail.length - 1; i >= 0; i -= 1) {
        setTail(fromTail.slice(0, i));
        await wait(70);
        if (cancelled) return;
      }
      await wait(220);
      if (cancelled) return;

      for (let i = 1; i <= toTail.length; i += 1) {
        setTail(toTail.slice(0, i));
        await wait(85);
        if (cancelled) return;
      }

      setEditing(false);
      await wait(loop ? 2600 : 1600);
    };

    const run = async () => {
      if (loop) {
        while (!cancelled) {
          await runCycle();
          if (cancelled) return;
        }
        return;
      }

      await runCycle();
      if (!cancelled) onCompleteRef.current?.();
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [loop]);

  useEffect(() => {
    if (!editing) return;
    const id = window.setInterval(() => setCaretOn((on) => !on), 450);
    return () => window.clearInterval(id);
  }, [editing]);

  const livePhrase = `${prefix}${tail}`;
  const markdownPhrase = editing ? `${livePhrase}${caretOn ? '|' : ' '}` : livePhrase;
  const liveCode = code.replace(
    /We build stuff that (?:we|you) care about/,
    markdownPhrase,
  );

  const cleaned = code
    .replace(/We build stuff that (?:we|you) care about/, livePhrase)
    .split('\n')
    .filter((line) => !/^:::/.test(line.trim()))
    .join('\n');
  const brand = firstHeading(cleaned, 2) ?? firstHeading(cleaned) ?? 'My Brand';
  const links = extractLinks(cleaned);
  const rest = stripLinks(stripHeadings(cleaned)).trim();

  return (
    <div className={`showcase-workflow-transform${className ? ` ${className}` : ''}`}>
      <div className="showcase-workflow-transform-source">
        <MarkdownHighlight source={liveCode} className="showcase-workflow-code is-compact" />
      </div>
      <div className="showcase-workflow-transform-arrow" aria-hidden>
        →
      </div>
      <div className="showcase-workflow-transform-result">
        <div className="showcase-workflow-preview">
          <p className="showcase-workflow-preview-brand">{brand}</p>
          <h4 className="showcase-workflow-preview-title">{livePhrase}</h4>
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
