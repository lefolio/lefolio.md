import type { Metadata } from 'next';
import { getSectionRoutes, loadManifest } from '@lefolio/engine/content';
import { metadataForHref } from '@lefolio/engine/seo';
import SectionIndex from '@/views/SectionIndex';
import StandalonePage from '@/views/StandalonePage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  if (section === '_') return {};
  return metadataForHref(loadManifest(), `/${section}/`);
}

export function generateStaticParams() {
  const params = getSectionRoutes();
  return params.length > 0 ? params : [{ section: '_' }];
}

export default async function SectionIndexPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionName } = await params;
  const manifest = loadManifest();

  const standalonePage = manifest.standalonePages.find((page) => page.sectionSlug === sectionName);
  if (standalonePage) {
    return <StandalonePage page={standalonePage} />;
  }

  const section = manifest.sections.find((item) => item.sectionSlug === sectionName);
  if (!section) {
    return <p className="text-muted">Section not found.</p>;
  }

  return <SectionIndex section={section} />;
}
