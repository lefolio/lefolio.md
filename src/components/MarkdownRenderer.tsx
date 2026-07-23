'use client';

import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/processor';
import 'katex/dist/katex.min.css';

const MermaidBlock = dynamic(() => import('./MermaidBlock'), { ssr: false });
const PlotlyBlock = dynamic(() => import('./PlotlyBlock'), { ssr: false });

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1];
  const code = String(children).replace(/\n$/, '');

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
        style={oneLight}
        PreTag="div"
        className="code-block"
        customStyle={{
          margin: '1.5rem 0',
          padding: '1rem 1.25rem',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: 1.6,
          overflowX: 'auto',
        }}
        codeTagProps={{
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

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Unwrap <pre> so fenced blocks can render as highlighter / mermaid / plotly
          // without nesting inside a second <pre>.
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
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
