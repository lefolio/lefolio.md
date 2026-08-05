'use client';

import { MarkdownBody } from '@/components/MarkdownBody';
import { useMarkdownComponents } from './MarkdownComponentsProvider';

interface ComponentHostProps {
  id: string;
  content: string;
}

export default function ComponentHost({ id, content }: ComponentHostProps) {
  const registry = useMarkdownComponents();
  const Component = registry[id];

  if (Component) {
    return <Component content={content} />;
  }

  // Unknown component for this template — render inner markdown as prose.
  if (!content.trim()) return null;
  return (
    <section data-component={id} data-component-fallback="">
      <MarkdownBody content={content} preprocessColumnBlocks={false} preprocessComponentBlocks={false} />
    </section>
  );
}
