import { getAllPageParams, getPage, loadManifest } from '@/lib/content/load-manifest';
import { getTemplate, resolveTemplateId } from '@/lib/templates/registry';

export function generateStaticParams() {
  const params = getAllPageParams();
  // `output: 'export'` requires at least one path for dynamic segments.
  return params.length > 0 ? params : [{ section: '_', slug: '_' }];
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const page = getPage(section, slug);

  if (!page) {
    return <p className="text-muted">Page not found.</p>;
  }

  const manifest = loadManifest();
  const { ContentPage: TemplateContentPage } = getTemplate(resolveTemplateId(manifest));
  return <TemplateContentPage page={page} />;
}
