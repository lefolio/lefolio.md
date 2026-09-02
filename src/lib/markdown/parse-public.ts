/**
 * Public surface for block-body markdown parsing.
 * Import from `@lefolio/engine/parse`.
 *
 * Layer 1 — primitives (`firstHeading`, `extractFirstImage`, …)
 * Layer 2 — structural split (`splitByHeading`)
 *
 * See wiki: block_parsing.md for recipes (Layer 3+) and template usage.
 */
export type { MdImage, MdLink, HeadingSection, SplitByHeadingResult } from './parse';

export {
  MD_IMAGE_PATTERN,
  MD_LINK_PATTERN,
  URL_IN_PARENS,
  mdImageRegExp,
  mdLinkRegExp,
} from './parse/patterns';

export {
  escapeRegExp,
  firstHeading,
  stripHeading,
  stripHeadings,
  extractFirstImage,
  extractAllImages,
  stripImages,
  extractLinks,
  stripLinks,
  paragraphs,
  splitParagraphs,
  firstPlainLine,
  stripFirstPlainLine,
  extractListItems,
  stripList,
  splitByHeading,
  splitByHeadingSections,
} from './parse';
