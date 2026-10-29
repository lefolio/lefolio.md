import SiteShell from './shell/SiteShell';
import HomeHero from './views/HomeHero';
import SectionIndex from './views/SectionIndex';
import ShowcaseContentPage from './views/ShowcaseContentPage';
import StandalonePage from './views/StandalonePage';
import LefolioHero from './components/Hero';
import PageHero from './components/PageHero';
import Workflow from './components/Workflow';
import UseCases from './components/UseCases';
import Showcase from './components/Showcase';
import Tools from './components/Tools';
import Connect from './components/Connect';
import Steps from './components/Steps';
import Split from './components/Split';
import Features from './components/Features';
import type { TemplateModule } from '@lefolio/engine/template';

export const showcaseTemplate: TemplateModule = {
  id: 'showcase',
  routing: 'multipage',
  colorScheme: 'light',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: HomeHero,
  SectionIndex,
  ContentPage: ShowcaseContentPage,
  StandalonePage,
  markdownComponents: {
    hero: PageHero,
    'lefolio-hero': LefolioHero,
    workflow: Workflow,
    'use-cases': UseCases,
    showcase: Showcase,
    tools: Tools,
    connect: Connect,
    steps: Steps,
    split: Split,
    features: Features,
  },
};

export { default as SectionPageList } from './views/SectionPageList';
export { default as HomeHero } from './views/HomeHero';
