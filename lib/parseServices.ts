import {
  extractStandaloneActions,
  firstHeading,
  splitByHeading,
  stripHeading,
  type MdAction,
} from '@lefolio/engine/markdown';

export interface ServiceItem {
  title: string;
  body: string;
}

export interface ParsedServices {
  title: string;
  intro: string;
  items: ServiceItem[];
  actions: MdAction[];
}

/**
 * `::: services`
 *
 * ```md
 * ## Services
 * Optional intro.
 * ### Offer one
 * Description…
 * - Bullet
 * ### Offer two
 * …
 * [[Contact|Get in touch]]
 * ```
 *
 * Standalone links at the end become section CTAs.
 */
export function parseServices(content: string): ParsedServices {
  const title = firstHeading(content, 2) || 'Services';
  const { prose, actions } = extractStandaloneActions(stripHeading(content, title));
  const { intro, sections } = splitByHeading(prose, 3);

  return {
    title,
    intro: intro.trim(),
    items: sections.map((section) => ({
      title: section.title,
      body: section.body.trim(),
    })),
    actions,
  };
}
