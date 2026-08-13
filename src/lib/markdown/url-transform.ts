/** Safe protocols allowed by micromark / react-markdown, plus LeFolio extras. */
const SAFE_PROTOCOLS = /^(https?|ircs?|mailto|xmpp|obsidian)$/i;

/**
 * Preserve safe http(s) links and allow Obsidian app URLs in markdown.
 * Matches react-markdown's defaultUrlTransform, extended with obsidian://.
 */
export function markdownUrlTransform(value: string): string {
  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');

  if (
    colon === -1 ||
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    SAFE_PROTOCOLS.test(value.slice(0, colon))
  ) {
    return value;
  }

  return '';
}
