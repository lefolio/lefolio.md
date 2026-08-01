import SiteShell from './shell/SiteShell';
import type { TemplateModule } from '@/lib/templates/types';

export const portfolioTemplate: TemplateModule = {
  id: 'portfolio',
  routing: 'multipage',
  Shell: SiteShell,
};

export { default as PortfolioHome } from './views/PortfolioHome';
export { default as SectionPageList } from './views/SectionPageList';
export { default as PortfolioContentPage } from './views/PortfolioContentPage';
