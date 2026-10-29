'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ContentManifest } from '@lefolio/engine/template';

export interface ContactConfig {
  email?: string;
  form?: string;
}

type ShowcaseConfig = ContentManifest['config'] & {
  contact?: ContactConfig;
};

const SiteConfigContext = createContext<ShowcaseConfig | null>(null);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: ContentManifest['config'];
  children: ReactNode;
}) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): ShowcaseConfig | null {
  return useContext(SiteConfigContext);
}
