import {
  escapeRegExp,
  extractFirstImage,
  extractLinks,
  extractListItems,
  firstHeading,
  firstPlainLine,
  paragraphs,
  splitByHeading,
  splitByHeadingSections,
  stripFirstPlainLine,
  stripHeading,
  stripHeadings,
  stripImages,
  stripLinks,
  stripList,
} from './index';

describe('@lefolio/engine/parse — Layer 1', () => {
  describe('firstHeading / stripHeading', () => {
    it('finds a heading at a specific level', () => {
      const md = 'Intro\n\n## About me\n\nBody';
      expect(firstHeading(md, 2)).toBe('About me');
      expect(firstHeading(md, 1)).toBeNull();
    });

    it('finds the first heading at any level when level is omitted', () => {
      expect(firstHeading('### Sub\n\n## Main')).toBe('Sub');
    });

    it('strips a heading by title', () => {
      const md = '## About me\n\nParagraph.';
      expect(stripHeading(md, 'About me')).toBe('Paragraph.');
    });
  });

  describe('stripHeadings', () => {
    it('removes all headings', () => {
      expect(stripHeadings('## A\n\n### B\n\nText')).toBe('Text');
    });

    it('removes only selected levels', () => {
      expect(stripHeadings('## Keep title\n\n### Remove\n\nBody', [3])).toBe(
        '## Keep title\n\nBody',
      );
    });
  });

  describe('extractFirstImage', () => {
    it('parses markdown images with parentheses in the URL', () => {
      const md =
        '![Portrait](/portfolio/content-assets/Assets/IMG-20250419-WA0003%20(2).jpg)\n\n## Hi';
      expect(extractFirstImage(md)).toEqual({
        alt: 'Portrait',
        src: '/portfolio/content-assets/Assets/IMG-20250419-WA0003%20(2).jpg',
      });
    });

    it('parses HTML img tags from sync output', () => {
      const md = '<figure><img src="/x.png" alt="Hero" /></figure>';
      expect(extractFirstImage(md)).toEqual({ alt: 'Hero', src: '/x.png' });
    });

    it('stripImages removes markdown and HTML images', () => {
      const md = 'Text\n\n![x](/a.jpg)\n\n<figure><img src="/b.png" /></figure>';
      expect(stripImages(md)).toBe('Text');
    });
  });

  describe('extractLinks', () => {
    it('extracts links with optional title attribute', () => {
      const md = '[Primary](/contact/ "primary") and [Secondary](#x "secondary")';
      expect(extractLinks(md)).toEqual([
        { text: 'Primary', href: '/contact/', title: 'primary' },
        { text: 'Secondary', href: '#x', title: 'secondary' },
      ]);
    });

    it('does not treat image links as text links', () => {
      expect(extractLinks('![img](/a.png)')).toEqual([]);
    });
  });

  describe('firstPlainLine', () => {
    it('skips headings, images, and list markers', () => {
      const md = ['![img](/a.png)', '## Title', '- list item', 'Eyebrow label', 'More text'].join(
        '\n',
      );
      expect(firstPlainLine(md)).toBe('Eyebrow label');
    });
  });

  describe('lists and paragraphs', () => {
    it('extractListItems returns bullet items', () => {
      expect(extractListItems('- C++\n- Rust\n\nParagraph')).toEqual(['C++', 'Rust']);
    });

    it('paragraphs splits on blank lines', () => {
      expect(paragraphs('One\n\nTwo\n\nThree')).toEqual(['One', 'Two', 'Three']);
    });
  });

  describe('escapeRegExp', () => {
    it('escapes regex metacharacters', () => {
      expect(escapeRegExp('a.b (2)')).toBe('a\\.b \\(2\\)');
    });
  });
});

describe('@lefolio/engine/parse — Layer 2', () => {
  describe('splitByHeading', () => {
    it('returns intro text and h3 sections', () => {
      const md = [
        'Intro paragraph.',
        '',
        '### Project A',
        '##### Subtitle A',
        'Body A',
        '',
        '### Project B',
        'Body B',
      ].join('\n');

      expect(splitByHeading(md, 3)).toEqual({
        intro: 'Intro paragraph.',
        sections: [
          { title: 'Project A', body: '##### Subtitle A\nBody A' },
          { title: 'Project B', body: 'Body B' },
        ],
      });
    });

    it('returns the full markdown as intro when no headings match', () => {
      expect(splitByHeading('Just prose.', 3)).toEqual({
        intro: 'Just prose.',
        sections: [],
      });
    });
  });

  describe('splitByHeadingSections', () => {
    it('returns only sections', () => {
      const md = 'Intro\n\n### One\n\nA\n\n### Two\n\nB';
      expect(splitByHeadingSections(md, 3)).toEqual([
        { title: 'One', body: 'A' },
        { title: 'Two', body: 'B' },
      ]);
    });
  });
});

describe('integration — typical block shapes', () => {
  it('featured card section: title, subtitle, image, body', () => {
    const section = splitByHeadingSections(
      [
        '### lefolio.md',
        '##### A static site generator',
        'Description paragraph.',
        '![logo](/assets/logo.png)',
      ].join('\n'),
      3,
    )[0];

    const subtitle = firstHeading(section.body, 5);
    const image = extractFirstImage(section.body);
    const body = stripImages(stripHeading(section.body, subtitle));

    expect(section.title).toBe('lefolio.md');
    expect(subtitle).toBe('A static site generator');
    expect(image?.src).toBe('/assets/logo.png');
    expect(body).toBe('Description paragraph.');
  });

  it('hero: image, title, CTA links from closing paragraph', () => {
    const md = [
      '![Portrait](/p.jpg)',
      '## Hi, I am Olivier.',
      'Lead paragraph.',
      '',
      '[Get in touch](/contact/)',
      '[Learn more](#about)',
    ].join('\n');

    const image = extractFirstImage(md);
    const title = firstHeading(md, 2);
    const rest = stripHeading(stripImages(md), title);
    const blocks = paragraphs(rest);
    const links = extractLinks(blocks.at(-1) ?? '');

    expect(image?.src).toBe('/p.jpg');
    expect(title).toBe('Hi, I am Olivier.');
    expect(links).toHaveLength(2);
    expect(blocks.slice(0, -1).join('\n\n')).toBe('Lead paragraph.');
  });
});
