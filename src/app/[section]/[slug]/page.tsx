import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getAllPageParams, getPage, loadManifest } from '@/lib/content/load-manifest';
import ShowcaseContentPage from '@/templates/showcase/views/ShowcaseContentPage';

export function generateStaticParams() {
  return getAllPageParams();
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
  const templateId = manifest.template ?? manifest.config.template ?? 'academic';

  if (templateId === 'showcase') {
    return <ShowcaseContentPage page={page} />;
  }

  return (
    <article>
      <p className="text-muted mb-2 text-sm uppercase tracking-wide">{page.section}</p>
      <h1 className="text-heading mb-6 text-3xl font-bold">{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
