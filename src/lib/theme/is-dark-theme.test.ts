import { describe, expect, it } from '@jest/globals';
import { isDarkThemeId } from './is-dark-theme';

describe('isDarkThemeId', () => {
  it('returns false for undefined or empty', () => {
    expect(isDarkThemeId(undefined)).toBe(false);
    expect(isDarkThemeId('')).toBe(false);
  });

  it('detects dark in the theme id', () => {
    expect(isDarkThemeId('slate-dark')).toBe(true);
    expect(isDarkThemeId('ink-dark')).toBe(true);
    expect(isDarkThemeId('atelier-dark')).toBe(true);
  });

  it('returns false for light themes', () => {
    expect(isDarkThemeId('slate-light')).toBe(false);
    expect(isDarkThemeId('pearl-light')).toBe(false);
  });
});
