import {
  extractStandaloneActions,
  firstHeading,
  stripHeading,
  type MdAction,
} from '@lefolio/engine/markdown';

export interface ParsedCta {
  title: string | null;
  body: string;
  actions: MdAction[];
}

/**
 * `::: cta`
 *
 * ```md
 * ## Questions about our tools or need a service?
 * Optional supporting line.
 * [[Contact|Get in Touch]]
 * ```
 */
export function parseCta(content: string): ParsedCta {
  const title = firstHeading(content, 2) ?? firstHeading(content, 1);
  const { prose, actions } = extractStandaloneActions(stripHeading(content, title));
  return {
    title,
    body: prose.trim(),
    actions,
  };
}
