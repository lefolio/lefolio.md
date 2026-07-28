'use client';

import type { CSSProperties } from 'react';
import { MarkdownBody } from './MarkdownBody';

interface ColumnsLayoutProps {
  columns: string[];
}

export default function ColumnsLayout({ columns }: ColumnsLayoutProps) {
  if (columns.length === 0) return null;

  return (
    <div
      className={`content-columns content-columns--${columns.length}`}
      style={{ '--content-columns': columns.length } as CSSProperties}
    >
      {columns.map((column, index) => (
        <div key={index} className="content-column">
          <MarkdownBody content={column} />
        </div>
      ))}
    </div>
  );
}
