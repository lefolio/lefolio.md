import { describe, expect, it } from '@jest/globals';
import {
  findPageByRelativePath,
  normalizeNavigationEntries,
  pageRoute,
  resolveNavigationItem,
  slugify,
} from './routing.mjs';

function pagesMap(entries) {
  return new Map(entries.map(([key, page]) => [key, page]));
}

describe('pageRoute', () => {
  it('maps home note to /', () => {
    expect(
      pageRoute({ relativePath: 'Home.md', section: null, slug: 'home' }, 'Home.md')
    ).toBe('/');
  });

  it('maps standalone root pages to /slug/', () => {
    expect(pageRoute({ relativePath: 'CV.md', section: null, slug: 'cv' }, 'Home.md')).toBe('/cv/');
  });

  it('slugifies standalone segment from relativePath basename', () => {
    expect(
      pageRoute({ relativePath: 'My Page.md', section: null, slug: 'my-page' }, 'Home.md')
    ).toBe('/my-page/');
  });

  it('maps section pages to /sectionslug/slug/', () => {
    expect(
      pageRoute(
        { relativePath: 'Blog/my-post.md', section: 'Blog', slug: 'my-post' },
        'Home.md'
      )
    ).toBe('/blog/my-post/');
  });

  it('lowercases section with spaces', () => {
    expect(
      pageRoute(
        { relativePath: 'My Blog/my-post.md', section: 'My Blog', slug: 'my-post' },
        'Home.md'
      )
    ).toBe('/my-blog/my-post/');
  });
});

describe('normalizeNavigationEntries', () => {
  it('returns [] for missing navigation', () => {
    expect(normalizeNavigationEntries(undefined)).toEqual([]);
    expect(normalizeNavigationEntries(null)).toEqual([]);
  });

  it('parses string array labels', () => {
    expect(normalizeNavigationEntries(['Blog', 'About'])).toEqual([
      { label: 'Blog' },
      { label: 'About' },
    ]);
  });

  it('parses yaml array of single-key objects', () => {
    expect(
      normalizeNavigationEntries([{ Shop: 'https://example.com' }, { Blog: null }])
    ).toEqual([
      { label: 'Shop', path: 'https://example.com' },
      { label: 'Blog', path: undefined },
    ]);
  });

  it('parses object map navigation', () => {
    expect(
      normalizeNavigationEntries({
        Blog: null,
        Shop: 'https://shop.example',
      })
    ).toEqual([
      { label: 'Blog', path: undefined },
      { label: 'Shop', path: 'https://shop.example' },
    ]);
  });
});

describe('resolveNavigationItem', () => {
  const homePath = 'Home.md';
  const blogPost = {
    relativePath: 'Blog/designer-menswear.md',
    section: 'Blog',
    slug: 'designer-menswear',
  };
  const cvPage = { relativePath: 'CV.md', section: null, slug: 'cv' };
  const pagesByPath = pagesMap([
    ['Blog/designer-menswear.md', blogPost],
    ['CV.md', cvPage],
  ]);

  it('resolves external explicit paths', () => {
    expect(
      resolveNavigationItem(
        { label: 'Shop', path: 'https://ericsalodesign.com' },
        pagesByPath,
        homePath
      )
    ).toEqual({
      label: 'Shop',
      href: 'https://ericsalodesign.com',
      type: 'external',
    });
  });

  it('resolves explicit content paths to page routes', () => {
    expect(
      resolveNavigationItem(
        { label: 'Post', path: 'Blog/designer-menswear.md' },
        pagesByPath,
        homePath
      )
    ).toEqual({
      label: 'Post',
      href: '/blog/designer-menswear/',
      type: 'page',
    });
  });

  it('resolves label to section when folder exists (slugified href)', () => {
    expect(
      resolveNavigationItem({ label: 'Blog' }, pagesByPath, homePath, {
        sectionFolderLabels: new Set(['Blog']),
      })
    ).toEqual({
      label: 'Blog',
      href: '/blog/',
      type: 'section',
    });
  });

  it('resolves label to standalone page by basename', () => {
    expect(resolveNavigationItem({ label: 'CV' }, pagesByPath, homePath)).toEqual({
      label: 'CV',
      href: '/cv/',
      type: 'page',
    });
  });

  it('resolves label to section page by slugified label', () => {
    expect(
      resolveNavigationItem({ label: 'Designer Menswear' }, pagesByPath, homePath)
    ).toEqual({
      label: 'Designer Menswear',
      href: '/blog/designer-menswear/',
      type: 'page',
    });
  });

  it('falls back to slugified section href for unknown labels', () => {
    expect(resolveNavigationItem({ label: 'Mystery' }, pagesByPath, homePath)).toEqual({
      label: 'Mystery',
      href: '/mystery/',
      type: 'section',
    });
  });
});

describe('findPageByRelativePath', () => {
  it('finds exact and basename matches', () => {
    const page = { relativePath: 'Blog/post.md', section: 'Blog', slug: 'post' };
    const map = pagesMap([['Blog/post.md', page]]);

    expect(findPageByRelativePath(map, 'Blog/post.md')).toBe(page);
    expect(findPageByRelativePath(map, 'post.md')).toBe(page);
  });
});

describe('slugify', () => {
  it('slugifies titles for nav matching', () => {
    expect(slugify('Designer Menswear')).toBe('designer-menswear');
  });
});
