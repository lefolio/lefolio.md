import type { ContentManifest, ManifestPage, NavSection, StandalonePage } from '@/lib/content/types';

export interface TemplateShellProps {
  manifest: ContentManifest;
  children: React.ReactNode;
}

export interface TemplateHomeProps {
  manifest: ContentManifest;
}

export interface TemplateSectionIndexProps {
  manifest: ContentManifest;
  section: NavSection;
}

export interface TemplateStandalonePageProps {
  manifest: ContentManifest;
  page: StandalonePage;
}

export interface TemplateContentPageProps {
  page: ManifestPage;
}

/**
 * Template contract. Shell is required; page views are optional and fall back to
 * engine defaults via `getTemplate()` so App Router routes stay template-agnostic.
 *
 * `loadStyles` must dynamically import that template's CSS entry so unused
 * templates are not bundled into globals.css.
 */
export interface TemplateModule {
  id: string;
  routing: 'multipage' | 'singlepage';
  Shell: React.FC<TemplateShellProps>;
  /** Async CSS entry (`import('./styles.css')`) — call from root layout only. */
  loadStyles: () => Promise<unknown>;
  Home?: React.FC<TemplateHomeProps>;
  SectionIndex?: React.FC<TemplateSectionIndexProps>;
  StandalonePage?: React.FC<TemplateStandalonePageProps>;
  ContentPage?: React.FC<TemplateContentPageProps>;
}

/** Template with view slots filled (defaults applied). */
export type ResolvedTemplateModule = TemplateModule &
  Required<
    Pick<TemplateModule, 'Home' | 'SectionIndex' | 'StandalonePage' | 'ContentPage'>
  >;
