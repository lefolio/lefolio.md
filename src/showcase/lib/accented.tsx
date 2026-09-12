import type { ReactNode } from 'react';

export type AccentPalette = 'auto' | 'yellow-green';

/** Pick yellow / green / blue accent from the bold phrase itself. */
function accentClassFor(chunk: string): string {
  const text = chunk.trim().toLowerCase();

  // Yellow — draft, tools
  if (/\bdraft\b/.test(text) || /\btools?\b/.test(text)) {
    return 'showcase-accent showcase-accent--yellow';
  }

  // Green — editable site, your life, website (hero)
  if (
    /\beditable site\b/.test(text) ||
    /\byour life\b/.test(text) ||
    /\bmaintainable website\b/.test(text)
  ) {
    return 'showcase-accent showcase-accent--green';
  }

  // Blue — more, lefolio, and other accents
  return 'showcase-accent';
}

function alternateClass(index: number): string {
  return index % 2 === 0
    ? 'showcase-accent showcase-accent--yellow'
    : 'showcase-accent showcase-accent--green';
}

/** Render `**bold**` spans with showcase accents (yellow / green / blue by phrase). */
export function AccentedText({
  text,
  palette = 'auto',
  start = 0,
}: {
  text: string;
  palette?: AccentPalette;
  /** Starting index for yellow-green alternation (0 = yellow). */
  start?: number;
}) {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  let accentIndex = start;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const className =
      palette === 'yellow-green' ? alternateClass(accentIndex) : accentClassFor(match[1]);
    nodes.push(
      <strong key={key} className={className}>
        {match[1]}
      </strong>
    );
    key += 1;
    accentIndex += 1;
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return <>{nodes}</>;
}
