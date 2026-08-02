import SiteShell from './shell/SiteShell';
import PortfolioHome from './views/PortfolioHome';
import SectionIndex from './views/SectionIndex';
import StandalonePage from './views/StandalonePage';
import PortfolioContentPage from './views/PortfolioContentPage';
import type { TemplateModule } from '@/lib/templates/types';

export const portfolioTemplate: TemplateModule = {
  id: 'portfolio',
  routing: 'multipage',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: PortfolioHome,
  SectionIndex,
  StandalonePage,
  ContentPage: PortfolioContentPage,
};

export { default as PortfolioHome } from './views/PortfolioHome';
export { default as SectionPageList } from './views/SectionPageList';
export { default as PortfolioContentPage } from './views/PortfolioContentPage';
