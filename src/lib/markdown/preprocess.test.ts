import { describe, expect, it } from '@jest/globals';
import { normalizeMarkdownSpacing, parseEmbed, parseWikilink } from './preprocess';

describe('parseWikilink', () => {
  it('parses target and optional alias', () => {
    expect(parseWikilink('[[Note]]')).toEqual({ target: 'Note', alias: undefined });
    expect(parseWikilink('[[Note|Label]]')).toEqual({ target: 'Note', alias: 'Label' });
  });

  it('returns null when there is no wikilink', () => {
    expect(parseWikilink('plain text')).toBeNull();
  });
});

describe('parseEmbed', () => {
  it('parses target and optional pixel width', () => {
    expect(parseEmbed('image.png')).toEqual({ target: 'image.png', width: undefined });
    expect(parseEmbed('image.png|320')).toEqual({ target: 'image.png', width: 320 });
    expect(parseEmbed('image.png|wide')).toEqual({ target: 'image.png', width: undefined });
  });
});

describe('normalizeMarkdownSpacing', () => {
  it('ensures a blank line before headings', () => {
    expect(normalizeMarkdownSpacing('para\n## Title')).toBe('para\n\n## Title');
  });

  it('collapses excess blank lines', () => {
    expect(normalizeMarkdownSpacing('a\n\n\n\nb')).toBe('a\n\nb');
  });
});
