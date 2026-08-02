import { describe, expect, it } from '@jest/globals';
import { resolveThemeId, themeOverrideStyle } from './resolve-theme';

describe('resolveThemeId', () => {
  it('returns a trimmed string theme as-is', () => {
    expect(resolveThemeId('  ink-dark  ')).toBe('ink-dark');
  });

  it('defaults to slate-light', () => {
    expect(resolveThemeId(undefined)).toBe('slate-light');
    expect(resolveThemeId({})).toBe('slate-light');
  });

  it('joins preset and mode', () => {
    expect(resolveThemeId({ preset: 'ink', mode: 'dark' })).toBe('ink-dark');
    expect(resolveThemeId({ preset: 'atelier', mode: 'light' })).toBe('atelier-light');
  });

  it('treats system mode as light', () => {
    expect(resolveThemeId({ preset: 'slate', mode: 'system' })).toBe('slate-light');
  });
});

describe('themeOverrideStyle', () => {
  it('returns empty for missing or string themes', () => {
    expect(themeOverrideStyle(undefined)).toEqual({});
    expect(themeOverrideStyle('ink-dark')).toEqual({});
    expect(themeOverrideStyle({ preset: 'slate' })).toEqual({});
  });

  it('maps known override keys to CSS variables', () => {
    expect(
      themeOverrideStyle({
        overrides: {
          primary: '#2563eb',
          textMuted: '#64748b',
          unknownKey: '#fff',
        },
      }),
    ).toEqual({
      '--color-primary': '#2563eb',
      '--color-text-muted': '#64748b',
    });
  });

  it('skips empty override values', () => {
    expect(
      themeOverrideStyle({
        overrides: {
          primary: '',
          bg: '#111',
        },
      }),
    ).toEqual({
      '--color-bg': '#111',
    });
  });
});
