import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ContentManifest } from '@/lib/content/types';

interface SaloHomeProps {
  manifest: ContentManifest;
}

export default function SaloHome({ manifest }: SaloHomeProps) {
  const body = manifest.home?.processedBody;
  if (!body) {
    return (
      <div className="salo-container" style={{ padding: '4rem 1rem' }}>
        <p>No home page content.</p>
      </div>
    );
  }

  return (
    <div className="salo-home">
      <MarkdownRenderer content={body} />
    </div>
  );
}
