/**
 * Shared markdown helpers for salo landing blocks.
 */

export interface MdLink {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/** Turn `[text](url){secondary}` into a titled markdown link for ReactMarkdown. */
export function preprocessLinkAttrs(markdown: string): string {
  return markdown.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)\{(\w+)\}/g,
    (_m, text: string, href: string, attr: string) => `[${text}](${href} "${attr}")`,
  );
}

/** Replace `:LiHeart:`-style icon shortcodes with marker HTML. */
export function preprocessIconShortcodes(markdown: string): string {
  return markdown.replace(/:Li([A-Za-z0-9]+):/g, (_m, name: string) => {
    const id = name.toLowerCase();
    return `<span class="salo-icon" data-icon="${id}" aria-hidden="true"></span>`;
  });
}

export function prepareSaloMarkdown(markdown: string): string {
  return preprocessIconShortcodes(preprocessLinkAttrs(markdown));
}

/** Markdown links only — skips image embeds `![alt](src)`. */
const LINK_RE = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

export function extractLinks(markdown: string): MdLink[] {
  const prepared = preprocessLinkAttrs(markdown);
  const links: MdLink[] = [];
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(prepared)) !== null) {
    const variant = match[3]?.toLowerCase() === 'secondary' ? 'secondary' : 'primary';
    links.push({ text: match[1] ?? '', href: match[2] ?? '', variant });
  }
  return links;
}

/** First image markdown/HTML src in a blob. */
export function extractFirstImageSrc(markdown: string): string | null {
  const md = markdown.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  if (md?.[1]) return md[1];
  const html = markdown.match(/<img[^>]+src=["']([^"']+)["']/i);
  return html?.[1] ?? null;
}

export function stripImages(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .trim();
}

export function stripLinks(markdown: string): string {
  return preprocessLinkAttrs(markdown)
    .replace(/(?<!!)\[([^\]]+)\]\([^)]+\)/g, '')
    .replace(/\{secondary\}/g, '')
    .trim();
}

/** Split on headings at `level` (e.g. 3 → ###). */
export function splitByHeading(
  markdown: string,
  level: number,
): Array<{ title: string; body: string }> {
  const re = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
  const indices: Array<{ title: string; index: number; endTitle: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    indices.push({
      title: (match[1] ?? '').trim(),
      index: match.index,
      endTitle: match.index + match[0].length,
    });
  }
  if (indices.length === 0) return [];

  return indices.map((item, i) => {
    const bodyStart = item.endTitle;
    const bodyEnd = i + 1 < indices.length ? indices[i + 1]!.index : markdown.length;
    return {
      title: item.title,
      body: markdown.slice(bodyStart, bodyEnd).trim(),
    };
  });
}

export function firstHeading(markdown: string, level?: number): string | null {
  const re = level ? new RegExp(`^#{${level}}\\s+(.+)$`, 'm') : /^#{1,6}\s+(.+)$/m;
  const match = markdown.match(re);
  return match?.[1]?.trim() ?? null;
}

export function stripHeadings(markdown: string): string {
  return markdown.replace(/^#{1,6}\s+.+$/gm, '').trim();
}
