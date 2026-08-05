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
