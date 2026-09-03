import SiteShell from './shell/SiteShell';
import HomeHero from './views/HomeHero';
import SectionIndex from './views/SectionIndex';
import ShowcaseContentPage from './views/ShowcaseContentPage';
import Hero from './components/Hero';
import Workflow from './components/Workflow';
import UseCases from './components/UseCases';
import Showcase from './components/Showcase';
import Tools from './components/Tools';
import Connect from './components/Connect';
import type { TemplateModule } from '@/lib/templates/types';

export const showcaseTemplate: TemplateModule = {
  id: 'showcase',
  routing: 'multipage',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: HomeHero,
  SectionIndex,
  ContentPage: ShowcaseContentPage,
  markdownComponents: {
    hero: Hero,
    workflow: Workflow,
    'use-cases': UseCases,
    showcase: Showcase,
    tools: Tools,
    connect: Connect,
  },
};

export { default as SectionPageList } from './views/SectionPageList';
export { default as HomeHero } from './views/HomeHero';
