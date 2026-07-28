'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { isDarkThemeId } from '@/lib/theme/is-dark-theme';

const DarkThemeContext = createContext(false);

export function ThemeProvider({
  themeId,
  children,
}: {
  themeId: string;
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(() => isDarkThemeId(themeId));

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(isDarkThemeId(root.dataset.theme));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return <DarkThemeContext.Provider value={dark}>{children}</DarkThemeContext.Provider>;
}

export function useDarkTheme(): boolean {
  return useContext(DarkThemeContext);
}
