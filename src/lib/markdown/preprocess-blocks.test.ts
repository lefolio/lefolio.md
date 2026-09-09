import { preprocessComponentBlocks, splitBlockFence } from './preprocess-blocks';

describe('preprocessComponentBlocks', () => {
  it('converts ::: testimonials into a lefolio-block fence', () => {
    const input = [
      '::: testimonials',
      '## Ada',
      '### Engineer',
      'Great work.',
      ':::',
    ].join('\n');
    const out = preprocessComponentBlocks(input);
    expect(out).toContain('```lefolio-block');
    expect(out).toContain('testimonials');
    expect(out).toContain('## Ada');
    expect(out).not.toContain('::: testimonials');
  });

  it('leaves ::: columns alone for the columns preprocessor', () => {
    const input = ['::: columns', 'left', ':::', 'right', ':::'].join('\n');
    expect(preprocessComponentBlocks(input)).toBe(input);
  });

  it('leaves plain prose alone', () => {
    expect(preprocessComponentBlocks('hello')).toBe('hello');
  });

  it('keeps nested ::: blocks inside the parent body', () => {
    const input = [
      '::: about',
      '## Story',
      '::: rating',
      '4.3 · 34 reviews',
      ':::',
      '[More](https://example.com)',
      ':::',
    ].join('\n');
    const out = preprocessComponentBlocks(input);
    expect(out).toContain('```lefolio-block');
    expect(out).toContain('about');
    expect(out).toContain('::: rating');
    expect(out).toContain('4.3 · 34 reviews');
    expect(out).toContain('[More](https://example.com)');
    // Outer closed — no leftover top-level :::
    expect(out.trim().endsWith('```')).toBe(true);
  });

  it('ignores ::: lines inside markdown code fences', () => {
    const input = [
      '::: workflow',
      '#### Draft',
      'Write structure first.',
      '```',
      '::: hero',
      '## Brand',
      ':::',
      '```',
      '#### Build',
      'Prompt your agent.',
      '```',
      'Build a lefolio site',
      '```',
      ':::',
    ].join('\n');
    const out = preprocessComponentBlocks(input);
    expect(out).toContain('workflow');
    expect(out).toContain('#### Draft');
    expect(out).toContain('#### Build');
    expect(out).toContain('::: hero');
    expect(out).toContain('Build a lefolio site');
    // Still a single lefolio-block — outer closed after both steps.
    expect(out.match(/lefolio-block/g)?.length).toBe(1);
    expect(out).toMatch(/`{4,}lefolio-block/);
  });
});

describe('splitBlockFence', () => {
  it('splits id and body', () => {
    expect(splitBlockFence('testimonials\n## A\n\nHi')).toEqual({
      id: 'testimonials',
      body: '## A\n\nHi',
    });
  });

  it('handles id-only', () => {
    expect(splitBlockFence('testimonials')).toEqual({
      id: 'testimonials',
      body: '',
    });
  });
});
