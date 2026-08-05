'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { MarkdownBlockComponent } from '@/lib/markdown/components/types';

const MarkdownComponentsContext = createContext<Record<string, MarkdownBlockComponent>>(
  {}
);

export function MarkdownComponentsProvider({
  components,
  children,
}: {
  components?: Record<string, MarkdownBlockComponent>;
  children: ReactNode;
}) {
  return (
    <MarkdownComponentsContext.Provider value={components ?? {}}>
      {children}
    </MarkdownComponentsContext.Provider>
  );
}

export function useMarkdownComponents(): Record<string, MarkdownBlockComponent> {
  return useContext(MarkdownComponentsContext);
}
