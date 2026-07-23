export interface SiteConfig {
  title: string;
  description?: string;
  url?: string;
  basePath?: string;
}

export interface AuthorConfig {
  name: string;
  pronouns?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  employer?: string;
  links?: Record<string, string>;
}

export type NavigationConfig =
  | string[]
  | Record<string, string | null>
  | Array<string | Record<string, string>>;

export interface ThemeConfig {
  preset?: string;
  mode?: 'light' | 'dark' | 'system';
  overrides?: Record<string, string>;
}

export interface AnalyticsConfig {
  /** GA4 measurement ID, e.g. G-XXXXXXXXXX */
  google?: string;
}

export interface ContentConfig {
  site: SiteConfig;
  home: string;
  author: AuthorConfig;
  navigation: NavigationConfig;
  template?: string;
  theme?: ThemeConfig | string;
  analytics?: AnalyticsConfig;
  /** Obsidian vault root for wikilink/embed resolution (relative to content dir, or absolute). */
  vault?: string;
}

export interface PageFrontmatter {
  title?: string;
  date?: string;
  order?: number;
  permalink?: string;
  authors?: string | string[];
  venue?: string;
  journal?: string;
  proceedings?: string;
  thumbnail?: string;
  display?: string;
  sort?: string;
  preview?: string;
  published?: boolean | string;
  [key: string]: unknown;
}

export interface ManifestPage {
  relativePath: string;
  section: string;
  slug: string;
  title: string;
  frontmatter: PageFrontmatter;
  processedBody: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  type: 'section' | 'page';
}

export interface SectionListItem {
  section: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  href: string;
  date?: string | null;
  authors: string[];
  venue?: string | null;
  thumbnail?: string | null;
  frontmatter?: PageFrontmatter;
}

export interface SectionIndexNote {
  relativePath: string;
  title: string;
  frontmatter: PageFrontmatter;
  processedBody: string;
}

export interface NavSection {
  name: string;
  display: string;
  preview?: string | null;
  index: SectionIndexNote | null;
  pages: SectionListItem[];
}

export interface StandalonePage {
  relativePath: string;
  segment: string;
  title: string;
  processedBody: string;
  href: string;
}

export interface ContentManifest {
  generatedAt: string;
  template: string;
  theme: string;
  config: ContentConfig;
  basePath: string;
  home: {
    relativePath: string;
    title: string;
    processedBody: string;
  } | null;
  navigation: NavItem[];
  sections: NavSection[];
  standalonePages: StandalonePage[];
  sectionRoutes: Array<{ section: string }>;
  pages: ManifestPage[];
  assets: Record<string, string>;
  authorAvatar: string | null;
}
