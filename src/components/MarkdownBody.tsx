'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/processor';
import { preprocessColumns } from '@/lib/markdown/preprocess-columns';
import { splitColumnFence } from '@/lib/markdown/preprocess-columns';
import { useDarkTheme } from '@/hooks/use-dark-theme';
import ColumnsLayout from './ColumnsLayout';
import 'katex/dist/katex.min.css';

const MermaidBlock = dynamic(() => import('./MermaidBlock'), { ssr: false });
const PlotlyBlock = dynamic(() => import('./PlotlyBlock'), { ssr: false });

interface MarkdownBodyProps {
  content: string;
  /** When false, nested column blocks are left untouched (used inside ColumnsLayout). */
  preprocessColumnBlocks?: boolean;
}

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const dark = useDarkTheme();
  const match = /language-([\w-]+)/.exec(className || '');
  const lang = match?.[1];
  const code = String(children).replace(/\n$/, '');

  if (lang === 'lefolio-columns') {
    return <ColumnsLayout columns={splitColumnFence(code)} />;
  }

  if (lang === 'mermaid') {
    return <MermaidBlock chart={code} />;
  }

  if (lang === 'plotly') {
    return <PlotlyBlock spec={code} />;
  }

  if (lang) {
    return (
      <SyntaxHighlighter
        language={lang}
        style={dark ? oneDark : oneLight}
        PreTag="div"
        className="code-block syntax-block"
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'var(--color-bg-alt)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          fontSize: 'inherit',
          fontWeight: 400,
          lineHeight: 1.6,
        }}
        codeTagProps={{
          className: 'syntax-block-code',
          style: {
            fontWeight: 400,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
  }

  if (code.includes('\n')) {
    return (
      <pre className="code-block">
        <code {...props}>{code}</code>
      </pre>
    );
  }

  return (
    <code className="inline-code" {...props}>
      {children}
    </code>
  );
}

function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export function MarkdownBody({ content, preprocessColumnBlocks = true }: MarkdownBodyProps) {
  const prepared = preprocessColumnBlocks ? preprocessColumns(content) : content;

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={{
        pre({ children }) {
          return <>{children}</>;
        },
        code: CodeBlock,
        a({ href, children, ...props }) {
          const external = isExternalHref(href);
          return (
            <a
              href={href}
              {...props}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {prepared}
    </ReactMarkdown>
  );
}
