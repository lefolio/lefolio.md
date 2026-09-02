/**
 * Shared markdown URL / embed patterns.
 *
 * Filenames such as `IMG (2).jpg` keep literal parentheses once
 * percent-encoded in sync output, so one level of balanced parens is allowed.
 */

/** Target inside markdown `(…)` including optional `"title"` attribute. */
export const URL_IN_PARENS = String.raw`((?:[^()\s]|\([^()\s]*\))*)(?:\s+"([^"]*)")?`;

export const MD_IMAGE_PATTERN = String.raw`!\[([^\]]*)\]\(${URL_IN_PARENS}\)`;
export const MD_LINK_PATTERN = String.raw`(?<!!)\[([^\]]+)\]\(${URL_IN_PARENS}\)`;

export function mdImageRegExp(flags = ''): RegExp {
  return new RegExp(MD_IMAGE_PATTERN, flags);
}

export function mdLinkRegExp(flags = ''): RegExp {
  return new RegExp(MD_LINK_PATTERN, flags);
}
