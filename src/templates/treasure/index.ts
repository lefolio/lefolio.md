import SiteShell from './shell/SiteShell';
import HomeView from './views/HomeView';
import SectionIndex from './views/SectionIndex';
import type { TemplateModule } from '@/lib/templates/types';

export const treasureTemplate: TemplateModule = {
  id: 'treasure',
  routing: 'multipage',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: HomeView,
  SectionIndex,
};

export { default as HomeView } from './views/HomeView';
export { default as SectionPageList } from './views/SectionPageList';
