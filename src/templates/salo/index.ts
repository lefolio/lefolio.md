import SiteShell from './shell/SiteShell';
import SaloHome from './views/SaloHome';
import SectionIndex from './views/SectionIndex';
import SaloContentPage from './views/SaloContentPage';
import Hero from './components/Hero';
import Headings from './components/Headings';
import Collections from './components/Collections';
import About from './components/About';
import Rating from './components/Rating';
import Features from './components/Features';
import Promo from './components/Promo';
import Newsletter from './components/Newsletter';
import type { TemplateModule } from '@/lib/templates/types';

export const saloTemplate: TemplateModule = {
  id: 'salo',
  routing: 'multipage',
  Shell: SiteShell,
  loadStyles: () => import('./styles.css'),
  Home: SaloHome,
  SectionIndex,
  ContentPage: SaloContentPage,
  markdownComponents: {
    hero: Hero,
    headings: Headings,
    collections: Collections,
    about: About,
    rating: Rating,
    features: Features,
    promo: Promo,
    newsletter: Newsletter,
  },
};
