import SiteShell from './shell/SiteShell';
import SectionIndex from './views/SectionIndex';
import type { TemplateModule } from '@/lib/templates/types';

export const academicTemplate: TemplateModule = {
  id: 'academic',
  routing: 'multipage',
  Shell: SiteShell,
  SectionIndex,
};

export { default as SectionPageList } from './views/SectionPageList';
