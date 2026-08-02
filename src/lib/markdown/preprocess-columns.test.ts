import { describe, expect, it } from '@jest/globals';
import { preprocessColumns, splitColumnFence } from './preprocess-columns';

describe('preprocessColumns', () => {
  it('converts a columns block into a lefolio-columns fence', () => {
    const input = ['::: columns', 'left', ':::', 'right', ':::'].join('\n');
    const out = preprocessColumns(input);
    expect(out).toContain('```lefolio-columns');
    expect(out).toContain('left');
    expect(out).toContain('right');
    expect(out).toContain('\u001e');
  });

  it('leaves markdown without columns unchanged (aside from trim)', () => {
    expect(preprocessColumns('just text')).toBe('just text');
  });
});

describe('splitColumnFence', () => {
  it('splits on the column separator', () => {
    expect(splitColumnFence(`one\n\u001e\ntwo`)).toEqual(['one', 'two']);
  });

  it('returns an empty list for blank bodies', () => {
    expect(splitColumnFence('')).toEqual([]);
    expect(splitColumnFence('   ')).toEqual([]);
  });
});
