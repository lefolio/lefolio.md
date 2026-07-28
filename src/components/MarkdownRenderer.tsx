'use client';

import { MarkdownBody } from './MarkdownBody';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-content">
      <MarkdownBody content={content} />
    </div>
  );
}
