import { loadManifest, getSectionRoutes } from '@/lib/content/load-manifest';
import { getTemplate, resolveTemplateId } from '@/lib/templates/registry';

export function generateStaticParams() {
  return getSectionRoutes();
}

export default async function SectionIndexPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionName } = await params;
  const manifest = loadManifest();
  const { SectionIndex, StandalonePage } = getTemplate(resolveTemplateId(manifest));

  const standalonePage = manifest.standalonePages.find(
    (page) => page.segment === sectionName
  );
  if (standalonePage) {
    return <StandalonePage manifest={manifest} page={standalonePage} />;
  }

  const section = manifest.sections.find((s) => s.name === sectionName);

  if (!section) {
    return <p className="text-muted">Section not found.</p>;
  }

  return <SectionIndex manifest={manifest} section={section} />;
}
