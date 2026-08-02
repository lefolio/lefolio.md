import { describe, expect, it } from '@jest/globals';
import {
  parseYouTubeShortId,
  parseYouTubeShortLine,
  preprocessYouTubeShorts,
} from './youtube-shorts';

describe('parseYouTubeShortId', () => {
  it('parses standard shorts URLs', () => {
    expect(parseYouTubeShortId('https://youtube.com/shorts/abc123XYZ')).toBe('abc123XYZ');
    expect(parseYouTubeShortId('https://www.youtube.com/shorts/abc123XYZ/')).toBe('abc123XYZ');
    expect(parseYouTubeShortId('https://m.youtube.com/shorts/abc123XYZ?si=1')).toBe('abc123XYZ');
  });

  it('rejects non-shorts URLs', () => {
    expect(parseYouTubeShortId(undefined)).toBeNull();
    expect(parseYouTubeShortId('https://youtube.com/watch?v=abc123XYZ')).toBeNull();
    expect(parseYouTubeShortId('not a url')).toBeNull();
  });
});

describe('parseYouTubeShortLine', () => {
  it('accepts bare URLs, angle URLs, and markdown links', () => {
    const url = 'https://youtube.com/shorts/abc123XYZ';
    expect(parseYouTubeShortLine(url)).toBe('abc123XYZ');
    expect(parseYouTubeShortLine(`<${url}>`)).toBe('abc123XYZ');
    expect(parseYouTubeShortLine(`[clip](${url})`)).toBe('abc123XYZ');
  });

  it('returns null for empty or mixed text', () => {
    expect(parseYouTubeShortLine('')).toBeNull();
    expect(parseYouTubeShortLine(`see https://youtube.com/shorts/abc123XYZ`)).toBeNull();
  });
});

describe('preprocessYouTubeShorts', () => {
  it('replaces a short URL with an embed placeholder', () => {
    const out = preprocessYouTubeShorts('https://youtube.com/shorts/abc123XYZ');
    expect(out).toContain('class="content-shorts-row"');
    expect(out).toContain('data-youtube-shorts="abc123XYZ"');
  });

  it('groups consecutive shorts into one row', () => {
    const out = preprocessYouTubeShorts(
      [
        'https://youtube.com/shorts/aaa111',
        '',
        'https://youtube.com/shorts/bbb222',
      ].join('\n'),
    );
    expect(out).toContain('data-youtube-shorts="aaa111,bbb222"');
    expect(out.match(/content-shorts-row/g)).toHaveLength(1);
  });

  it('leaves surrounding prose alone', () => {
    const out = preprocessYouTubeShorts('Hello\n\nhttps://youtube.com/shorts/abc123XYZ\n\nBye');
    expect(out.startsWith('Hello')).toBe(true);
    expect(out.endsWith('Bye')).toBe(true);
  });
});
