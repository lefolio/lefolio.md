import {
  extractAllImages,
  extractStandaloneActions,
  firstHeading,
  splitByHeading,
  stripHeading,
  stripImages,
  type MdAction,
  type MdImage,
} from '@lefolio/engine/markdown';

export interface PortfolioItem {
  title: string;
  body: string;
  images: MdImage[];
  actions: MdAction[];
}

export interface ParsedPortfolio {
  title: string;
  intro: string;
  items: PortfolioItem[];
}

/**
 * `::: portfolio`
 *
 * ```md
 * ## Section title
 * Optional intro.
 * ### Item one
 * Description…
 * [Learn more](/path/)
 * ### Item two
 * …
 * ```
 */
export function parsePortfolio(content: string): ParsedPortfolio {
  const title = firstHeading(content, 2) || 'Portfolio';
  const { intro, sections } = splitByHeading(stripHeading(content, title), 3);

  const items = sections.map((section) => {
    const images = extractAllImages(section.body);
    const { prose, actions } = extractStandaloneActions(stripImages(section.body));
    return {
      title: section.title,
      body: prose.trim(),
      images,
      actions,
    };
  });

  return {
    title,
    intro: intro.trim(),
    items,
  };
}
