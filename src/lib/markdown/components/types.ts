import type { ComponentType } from 'react';

export interface MarkdownBlockProps {
  /** Inner markdown (already sync-processed). */
  content: string;
}

export type MarkdownBlockComponent = ComponentType<MarkdownBlockProps>;
