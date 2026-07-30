import MarkdownRenderer from '@/components/MarkdownRenderer';
import { loadManifest } from '@/lib/content/load-manifest';
import HomeHero from '@/templates/showcase/views/HomeHero';
import HomeView from '@/templates/treasure/views/HomeView';

export default function HomePage() {
  const manifest = loadManifest();
  const templateId = manifest.template ?? manifest.config.template ?? 'academic';

  if (templateId === 'treasure') {
    return <HomeView manifest={manifest} />;
  }

  if (templateId === 'showcase') {
    return <HomeHero manifest={manifest} />;
  }

  const home = manifest.home;

  if (!home) {
    return (
      <article>
        <h1 className="text-heading mb-6 text-3xl font-bold">Home</h1>
        <p className="text-muted">Configure `home` in config.yaml.</p>
      </article>
    );
  }

  return (
    <article>
      <h1 className="text-heading mb-6 text-3xl font-bold">{home.title}</h1>
      <MarkdownRenderer content={home.processedBody} />
    </article>
  );
}
