export function isDarkThemeId(theme: string | undefined): boolean {
  if (!theme) return false;
  return theme.includes('dark');
}
