import SiteShell from './shell/SiteShell';
import HomeHero from './views/HomeHero';
import SectionIndex from './views/SectionIndex';
import ShowcaseContentPage from './views/ShowcaseContentPage';
import type { TemplateModule } from '@/lib/templates/types';

export const showcaseTemplate: TemplateModule = {
  id: 'showcase',
  routing: 'multipage',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: HomeHero,
  SectionIndex,
  ContentPage: ShowcaseContentPage,
};

export { default as SectionPageList } from './views/SectionPageList';
export { default as HomeHero } from './views/HomeHero';
