import Connect from '@/components/Connect';
import ContactForm from '@/components/ContactForm';
import Cta from '@/components/Cta';
import Features from '@/components/Features';
import LefolioHero from '@/components/Hero';
import PageHero from '@/components/PageHero';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Showcase from '@/components/Showcase';
import Split from '@/components/Split';
import Steps from '@/components/Steps';
import Tools from '@/components/Tools';
import UseCases from '@/components/UseCases';
import Workflow from '@/components/Workflow';

export const markdownComponents = {
  hero: PageHero,
  'lefolio-hero': LefolioHero,
  workflow: Workflow,
  'use-cases': UseCases,
  showcase: Showcase,
  tools: Tools,
  portfolio: Portfolio,
  // Common misspelling of the fence name in drafts.
  portefolio: Portfolio,
  services: Services,
  cta: Cta,
  connect: Connect,
  steps: Steps,
  split: Split,
  features: Features,
  contact: ContactForm,
};
