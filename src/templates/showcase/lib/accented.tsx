import type { ReactNode } from 'react';

/** Render `**bold**` spans with the showcase accent color. */
export function AccentedText({
  text,
  warm = false,
}: {
  text: string;
  /** Alternate yellow / green accents for a warmer look. */
  warm?: boolean;
}) {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const tone = warm
      ? key % 2 === 0
        ? ' showcase-accent--yellow'
        : ' showcase-accent--green'
      : '';
    nodes.push(
      <strong key={key} className={`showcase-accent${tone}`}>
        {match[1]}
      </strong>
    );
    key += 1;
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return <>{nodes}</>;
}
