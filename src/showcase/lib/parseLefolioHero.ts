import {
  extractFirstImage,
  extractLinks,
  firstPlainLine,
  paragraphs,
  splitByHeading,
  stripImages,
  stripLinks,
  type MdImage,
  type MdLink,
} from '@lefolio/engine/parse';

export interface LefolioHeroContent {
  /** Plain line(s) before the `#` title — eyebrow / kicker. */
  kicker: string | null;
  /** `#` heading text (may include `**bold**` for accents). */
  title: string | null;
  /** First prose paragraph after the title (links stripped). */
  lead: string;
  actions: MdLink[];
  image: MdImage | null;
}

/**
 * Parse `::: lefolio-hero` body:
 *
 * ```md
 * Optional kicker above the title
 * # Title with **highlights**
 *
 * Lead paragraph.
 *
 * [Primary](/)
 * [Secondary](/more)
 * ```
 */
export function parseLefolioHero(content: string): LefolioHeroContent {
  const image = extractFirstImage(content);
  const withoutImages = stripImages(content);
  const { intro, sections } = splitByHeading(withoutImages, 1);
  const title = sections[0]?.title ?? null;
  const body = sections[0]?.body ?? (title ? '' : withoutImages);

  const kicker =
    firstPlainLine(intro) ??
    (intro.trim() && !intro.trim().startsWith('[') ? intro.trim() : null);

  const actions = extractLinks(body);
  const lead =
    paragraphs(stripLinks(body)).find((block) => !block.startsWith('#')) ?? '';

  return { kicker, title, lead, actions, image };
}
