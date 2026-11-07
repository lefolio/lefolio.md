import type { Metadata } from 'next';
import { getPage, loadManifest, pageParams } from '@lefolio/engine/content';
import { metadataForHref } from '@lefolio/engine/seo';
import ShowcaseContentPage from '@/views/ShowcaseContentPage';

function joinSlug(slug: string | string[]): string {
  return Array.isArray(slug) ? slug.join('/') : slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string[] }>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const pathSlug = joinSlug(slug);
  if (section === '_' || pathSlug === '_') return {};
  return metadataForHref(loadManifest(), `/${section}/${pathSlug}/`);
}

export function generateStaticParams() {
  return pageParams();
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ section: string; slug: string[] }>;
}) {
  const { section, slug } = await params;
  const page = getPage(section, joinSlug(slug));
  if (!page) return <p className="text-muted">Page not found.</p>;
  return <ShowcaseContentPage page={page} />;
}
