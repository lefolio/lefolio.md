import { markdownUrlTransform } from './url-transform';

describe('markdownUrlTransform', () => {
  it('preserves obsidian deep links', () => {
    expect(markdownUrlTransform('obsidian://show-plugin?id=terminal')).toBe(
      'obsidian://show-plugin?id=terminal'
    );
    expect(markdownUrlTransform('obsidian://open?vault=MyVault&file=Note')).toBe(
      'obsidian://open?vault=MyVault&file=Note'
    );
  });

  it('preserves standard safe URLs', () => {
    expect(markdownUrlTransform('https://example.com')).toBe('https://example.com');
    expect(markdownUrlTransform('mailto:hello@example.com')).toBe('mailto:hello@example.com');
  });

  it('preserves relative paths', () => {
    expect(markdownUrlTransform('/blog/post/')).toBe('/blog/post/');
    expect(markdownUrlTransform('#section')).toBe('#section');
  });

  it('blocks javascript URLs', () => {
    expect(markdownUrlTransform('javascript:alert(1)')).toBe('');
  });
});
