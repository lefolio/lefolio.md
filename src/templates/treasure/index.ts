import SiteShell from './shell/SiteShell';
import type { TemplateModule } from '@/lib/templates/types';

export const treasureTemplate: TemplateModule = {
  id: 'treasure',
  routing: 'multipage',
  Shell: SiteShell,
};

export { default as HomeView } from './views/HomeView';
export { default as SectionPageList } from './views/SectionPageList';
