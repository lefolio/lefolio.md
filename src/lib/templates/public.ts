/**
 * Public surface for external / site-local TemplateModule source.
 * Import from `@lefolio/engine/template`.
 */
export type {
  TemplateModule,
  ResolvedTemplateModule,
  TemplateShellProps,
  TemplateHomeProps,
  TemplateSectionIndexProps,
  TemplateStandalonePageProps,
  TemplateContentPageProps,
} from './types';

export type {
  ContentManifest,
  ContentConfig,
  ManifestPage,
  NavItem,
  NavSection,
  SectionListItem,
  StandalonePage,
} from '@/lib/content/types';

export type {
  MarkdownBlockComponent,
  MarkdownBlockProps,
} from '@/lib/markdown/components/types';

export { slugify } from '@/lib/utils/slugify';
