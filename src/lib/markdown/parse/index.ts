/**
 * Layer 1 — core markdown structure helpers for `::: block` inner content.
 *
 * Operates on **sync-processed** markdown strings (`processedBody` fragments):
 * wikilinks are already resolved to `![alt](url)` or `<figure>` / `<img>`.
 */

import { MD_IMAGE_PATTERN, MD_LINK_PATTERN, mdImageRegExp, mdLinkRegExp } from './patterns';

export interface MdImage {
  src: string;
  alt: string;
}

export interface MdLink {
  text: string;
  href: string;
  /** Value of the markdown link title attribute: `[text](url "title")`. */
  title?: string;
}

export interface HeadingSection {
  title: string;
  body: string;
}

export interface SplitByHeadingResult {
  /** Markdown before the first heading at `level`. */
  intro: string;
  sections: HeadingSection[];
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function firstHeading(markdown: string, level?: number): string | null {
  const re = level ? new RegExp(`^#{${level}}\\s+(.+)$`, 'm') : /^#{1,6}\s+(.+)$/m;
  const match = markdown.match(re);
  return match?.[1]?.trim() ?? null;
}

/** Remove the first heading line whose text matches `title` (any `#` level). */
export function stripHeading(markdown: string, title: string | null): string {
  if (!title) return markdown.trim();
  return markdown
    .replace(new RegExp(`^#{1,6}\\s+${escapeRegExp(title)}\\s*$`, 'm'), '')
    .replace(/^\s+/, '')
    .trim();
}

/** Remove all ATX headings, optionally limited to specific levels. */
export function stripHeadings(markdown: string, levels?: number[]): string {
  let result: string;
  if (!levels || levels.length === 0) {
    result = markdown.replace(/^#{1,6}\s+.+$/gm, '');
  } else {
    const allowed = new Set(levels);
    result = markdown
      .split('\n')
      .filter((line) => {
        const match = /^(#{1,6})\s+/.exec(line);
        if (!match) return true;
        return !allowed.has(match[1].length);
      })
      .join('\n');
  }
  return result.replace(/\n{3,}/g, '\n\n').trim();
}

export function extractFirstImage(markdown: string): MdImage | null {
  const md = markdown.match(mdImageRegExp());
  if (md?.[2]) {
    return { alt: md[1] ?? '', src: md[2] };
  }

  const html = markdown.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (html?.[1]) {
    const alt = html[0].match(/alt=["']([^"']*)["']/i)?.[1] ?? '';
    return { alt, src: html[1] };
  }

  return null;
}

export function extractAllImages(markdown: string): MdImage[] {
  const items: MdImage[] = [];
  const seen = new Set<string>();
  const re = mdImageRegExp('g');

  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    const src = match[2] ?? '';
    if (!src || seen.has(src)) continue;
    seen.add(src);
    items.push({ alt: match[1] ?? '', src });
  }

  const htmlRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlRe.exec(markdown)) !== null) {
    const src = match[1] ?? '';
    if (!src || seen.has(src)) continue;
    seen.add(src);
    const alt = match[0].match(/alt=["']([^"']*)["']/i)?.[1] ?? '';
    items.push({ alt, src });
  }

  return items;
}

export function stripImages(markdown: string): string {
  return markdown
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(new RegExp(MD_IMAGE_PATTERN, 'g'), '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractLinks(markdown: string): MdLink[] {
  const links: MdLink[] = [];
  const re = mdLinkRegExp('g');

  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    links.push({
      text: match[1] ?? '',
      href: match[2] ?? '',
      title: match[3]?.trim() || undefined,
    });
  }

  return links;
}

export function stripLinks(markdown: string): string {
  return markdown
    .replace(new RegExp(MD_LINK_PATTERN, 'g'), '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Paragraph blocks separated by blank lines. */
export function paragraphs(markdown: string): string[] {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

/** Alias for {@link paragraphs}. */
export const splitParagraphs = paragraphs;

export function firstPlainLine(markdown: string): string | null {
  const line = markdown
    .split('\n')
    .map((entry) => entry.trim())
    .find(
      (entry) =>
        entry &&
        !entry.startsWith('#') &&
        !entry.startsWith('!') &&
        !entry.startsWith('[') &&
        !entry.startsWith('<') &&
        !entry.startsWith('-') &&
        !entry.startsWith('*') &&
        !entry.startsWith('+'),
    );
  return line ?? null;
}

export function stripFirstPlainLine(markdown: string, line: string | null): string {
  if (!line) return markdown.trim();
  return markdown.replace(new RegExp(`^\\s*${escapeRegExp(line)}\\s*$`, 'm'), '').trim();
}

export function extractListItems(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => line.match(/^\s*[-*+]\s+(.+)$/)?.[1]?.trim())
    .filter((item): item is string => Boolean(item));
}

export function stripList(markdown: string): string {
  return markdown
    .split('\n')
    .filter((line) => !/^\s*[-*+]\s+/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Split markdown at headings of `level`.
 *
 * Deeper headings (e.g. `#####` under `###`) stay inside each section body.
 * Text before the first matching heading is returned as `intro`.
 */
export function splitByHeading(markdown: string, level: number): SplitByHeadingResult {
  const re = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
  const marks: Array<{ title: string; start: number; bodyStart: number }> = [];

  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    marks.push({
      title: (match[1] ?? '').trim(),
      start: match.index,
      bodyStart: match.index + match[0].length,
    });
  }

  if (marks.length === 0) {
    return { intro: markdown.trim(), sections: [] };
  }

  const intro = markdown.slice(0, marks[0].start).trim();
  const sections = marks.map((mark, index) => {
    const end = index + 1 < marks.length ? marks[index + 1].start : markdown.length;
    return {
      title: mark.title,
      body: markdown.slice(mark.bodyStart, end).trim(),
    };
  });

  return { intro, sections };
}

/** Convenience when only the titled sections are needed (no intro). */
export function splitByHeadingSections(markdown: string, level: number): HeadingSection[] {
  return splitByHeading(markdown, level).sections;
}
