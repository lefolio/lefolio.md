export interface ParsedTestimonial {
  name: string;
  title?: string;
  /** Inner markdown for the quote / body (paragraphs, blockquotes, etc.). */
  bodyMarkdown: string;
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;

/**
 * Split testimonials markdown into items.
 *
 * The most prioritary (lowest-number) heading level that appears starts a new
 * testimonial and supplies the **name**. The next level down is an optional
 * **title/role**. Everything until the next name-level heading is the body.
 *
 * Examples:
 * - `## Name` / `### Title` / paragraphs
 * - `### Name` / `#### Title` / blockquote
 */
export function parseTestimonials(markdown: string): ParsedTestimonial[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const headingLevels: number[] = [];

  for (const line of lines) {
    const match = HEADING_RE.exec(line.trim());
    if (match) headingLevels.push(match[1].length);
  }

  if (headingLevels.length === 0) {
    const body = markdown.trim();
    return body ? [{ name: '', bodyMarkdown: body }] : [];
  }

  const nameLevel = Math.min(...headingLevels);
  const titleLevel = nameLevel + 1;

  const items: ParsedTestimonial[] = [];
  let current: ParsedTestimonial | null = null;
  let bodyLines: string[] = [];

  const flush = () => {
    if (!current) return;
    current.bodyMarkdown = bodyLines.join('\n').trim();
    items.push(current);
    current = null;
    bodyLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const match = HEADING_RE.exec(trimmed);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();

      if (level === nameLevel) {
        flush();
        current = { name: text, bodyMarkdown: '' };
        continue;
      }

      if (current && level === titleLevel && current.title === undefined && bodyLines.every((l) => !l.trim())) {
        current.title = text;
        continue;
      }
    }

    if (current) {
      bodyLines.push(line);
    }
  }

  flush();
  return items.filter((item) => item.name || item.bodyMarkdown);
}
