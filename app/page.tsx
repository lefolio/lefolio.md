import type { Metadata } from 'next';
import { loadManifest } from '@lefolio/engine/content';
import { metadataForHref } from '@lefolio/engine/seo';
import HomeHero from '@/views/HomeHero';

export function generateMetadata(): Metadata {
  return metadataForHref(loadManifest(), '/');
}

export default function HomePage() {
  return <HomeHero manifest={loadManifest()} />;
}
