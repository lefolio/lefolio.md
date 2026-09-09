import type { ReactNode } from 'react';

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

function renderTokens(tokens: Token[]): ReactNode[] {
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
      case 'punct':
        return (
          <span key={key} className="hero-md-punct">
            {token.value}
          </span>
        );
      default:
        return <span key={key}>{token.value}</span>;
    }
  });
}

/** Static syntax-colored markdown for demos (reuses hero-md-* styles). */
export function MarkdownHighlight({
  source,
  className = '',
}: {
  source: string;
  className?: string;
}) {
  const lines = source.replace(/\n$/, '').split('\n');

  return (
    <pre className={`showcase-md-highlight${className ? ` ${className}` : ''}`}>
      <code>
        {lines.map((line, index) => {
          const { headingLevel, tokens } = tokenizeLine(line);
          return (
            <span
              key={`line-${index}`}
              className={
                headingLevel > 0
                  ? `hero-md-line hero-md-heading hero-md-heading-${Math.min(headingLevel, 3)}`
                  : 'hero-md-line'
              }
            >
              {renderTokens(tokens)}
              {'\n'}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
