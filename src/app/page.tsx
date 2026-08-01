import { loadManifest } from '@/lib/content/load-manifest';
import { getTemplate, resolveTemplateId } from '@/lib/templates/registry';

export default function HomePage() {
  const manifest = loadManifest();
  const { Home } = getTemplate(resolveTemplateId(manifest));
  return <Home manifest={manifest} />;
}
