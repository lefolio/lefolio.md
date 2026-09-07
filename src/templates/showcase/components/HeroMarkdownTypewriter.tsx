'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'fence'; value: string }
  | { kind: 'hash'; value: string }
  | { kind: 'marker'; value: string }
  | { kind: 'strong'; value: string }
  | { kind: 'link-text'; value: string }
  | { kind: 'link-url'; value: string }
  | { kind: 'punct'; value: string };

function tokenizeInline(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: 'text', value: text.slice(last, match.index) });
    }
    const chunk = match[0];
    if (chunk.startsWith('**')) {
      tokens.push({ kind: 'marker', value: '**' });
      tokens.push({ kind: 'strong', value: chunk.slice(2, -2) });
      tokens.push({ kind: 'marker', value: '**' });
    } else if (chunk.startsWith('[')) {
      const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        tokens.push({ kind: 'punct', value: '[' });
        tokens.push({ kind: 'link-text', value: link[1] });
        tokens.push({ kind: 'punct', value: '](' });
        tokens.push({ kind: 'link-url', value: link[2] });
        tokens.push({ kind: 'punct', value: ')' });
      } else {
        tokens.push({ kind: 'text', value: chunk });
      }
    } else {
      tokens.push({ kind: 'marker', value: chunk });
    }
    last = match.index + chunk.length;
  }
  if (last < text.length) tokens.push({ kind: 'text', value: text.slice(last) });
  return tokens;
}

function tokenizeLine(line: string): { headingLevel: number; tokens: Token[] } {
  if (/^:::/.test(line)) {
    return { headingLevel: 0, tokens: [{ kind: 'fence', value: line }] };
  }

  const heading = line.match(/^(#{1,6})(\s+)(.*)$/);
  if (heading) {
    return {
      headingLevel: heading[1].length,
      tokens: [
        { kind: 'hash', value: heading[1] },
        { kind: 'text', value: heading[2] },
        ...tokenizeInline(heading[3]),
      ],
    };
  }

  return { headingLevel: 0, tokens: tokenizeInline(line) };
}

function renderTokens(tokens: Token[]) {
  return tokens.map((token, index) => {
    const key = `${token.kind}-${index}-${token.value.slice(0, 12)}`;
    switch (token.kind) {
      case 'fence':
        return (
          <span key={key} className="hero-md-fence">
            {token.value}
          </span>
        );
      case 'hash':
        return (
          <span key={key} className="hero-md-hash">
            {token.value}
          </span>
        );
      case 'marker':
      case 'punct':
        return (
          <span key={key} className="hero-md-marker">
            {token.value}
          </span>
        );
      case 'strong':
        return (
          <strong key={key} className="hero-md-strong">
            {token.value}
          </strong>
        );
      case 'link-text':
        return (
          <span key={key} className="hero-md-link-text">
            {token.value}
          </span>
        );
      case 'link-url':
        return (
          <span key={key} className="hero-md-link-url">
            {token.value}
          </span>
        );
      default:
        return <span key={key}>{token.value}</span>;
    }
  });
}

export function highlightMarkdownSlice(
  source: string,
  options?: { showCaret?: boolean },
) {
  const lines = source.split('\n');
  return lines.map((line, lineIndex) => {
    const { headingLevel, tokens } = tokenizeLine(line);
    const isLast = lineIndex === lines.length - 1;
    return (
      <div
        key={`line-${lineIndex}`}
        className={
          headingLevel > 0
            ? `hero-md-line hero-md-heading hero-md-heading-${Math.min(headingLevel, 3)}`
            : 'hero-md-line'
        }
      >
        {line.length === 0 && !(isLast && options?.showCaret) ? '\u00A0' : null}
        {line.length > 0 ? renderTokens(tokens) : null}
        {isLast && options?.showCaret ? (
          <span className="hero-md-caret" aria-hidden />
        ) : null}
        {!isLast ? '\n' : null}
      </div>
    );
  });
}

function splitFenceSource(source: string) {
  const normalized = source.replace(/\n+$/, '');
  const lines = normalized.split('\n');
  const openLine = lines[0] ?? ':::';
  const closeLine =
    lines.length > 1 && /^:::\s*$/.test(lines[lines.length - 1])
      ? lines[lines.length - 1]
      : ':::';
  const middle =
    lines.length > 2
      ? lines.slice(1, -1).join('\n')
      : lines.length === 2 && !/^:::\s*$/.test(lines[1])
        ? lines[1]
        : '';
  const progressTarget = middle ? `${openLine}\n${middle}` : openLine;
  return { openLine, middle, closeLine, progressTarget };
}

/** Delay before typing the character at `index` of the progress target. */
function delayBeforeChar(source: string, index: number): number {
  if (index <= 0) return 320;

  const prev = source[index - 1];
  const next = source[index];

  // After opening `:::`, pause before typing " hero"
  if (index === 3 && source.startsWith(':::')) return 480;

  // Fast-path the lead paragraph about draft → editable site
  const leadStart = source.indexOf('Iterate from draft to editable site');
  if (leadStart >= 0) {
    const leadEnd = source.indexOf('\n', leadStart);
    const end = leadEnd === -1 ? source.length : leadEnd;
    if (index > leadStart && index <= end) {
      return 11 + (index % 9 === 0 ? 6 : 0);
    }
  }

  if (prev === '\n') {
    const lineStart = source.lastIndexOf('\n', index - 2) + 1;
    const prevLine = source.slice(lineStart, index - 1);
    if (/^:::/.test(prevLine)) return 420;
    if (prevLine.trim() === '') return 200;
    return 160;
  }

  if (prev === '.' || prev === '!' || prev === '?') return 200;
  if (prev === ':' && next === '\n') return 240;
  if (prev === '*' && next === '*') return 70;
  if (prev === '*' && source[index - 2] === '*') return 55;

  // Regular text cadence
  return 11 + (index % 7 === 0 ? 6 : 0);
}

interface HeroMarkdownTypewriterProps {
  source: string;
  onComplete: () => void;
  /** How long to keep the finished markdown visible before handing off. */
  holdMs?: number;
}

export default function HeroMarkdownTypewriter({
  source,
  onComplete,
  holdMs = 1000,
}: HeroMarkdownTypewriterProps) {
  const { closeLine, progressTarget } = useMemo(
    () => splitFenceSource(source),
    [source],
  );
  const [typed, setTyped] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTyped(progressTarget.length);
      onCompleteRef.current();
      return;
    }

    let cancelled = false;
    let timer = 0;
    let index = 0;

    const step = () => {
      if (cancelled) return;
      if (index >= progressTarget.length) {
        timer = window.setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, holdMs);
        return;
      }

      const wait = delayBeforeChar(progressTarget, index);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        index += 1;
        setTyped(index);
        step();
      }, wait);
    };

    step();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [progressTarget, holdMs, reducedMotion]);

  const progress = progressTarget.slice(0, typed);
  const showClosing = progress.startsWith(':::') && progress.length >= 3;
  const done = typed >= progressTarget.length;

  return (
    <div className="showcase-hero-typewriter" aria-hidden={!done}>
      <pre className="showcase-hero-md">
        <code className="hero-md-sizer" aria-hidden>
          {highlightMarkdownSlice(source)}
        </code>
        <code className="hero-md-live">
          {highlightMarkdownSlice(progress, { showCaret: !done })}
          {showClosing ? (
            <>
              {progress.includes('\n') ? (progress.endsWith('\n') ? null : '\n') : '\n\n'}
              {highlightMarkdownSlice(closeLine)}
            </>
          ) : null}
        </code>
      </pre>
    </div>
  );
}
