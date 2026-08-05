'use client';

import dynamic from 'next/dynamic';
import { Children, isValidElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { remarkPlugins, rehypePlugins } from '@/lib/markdown/processor';
import { preprocessColumns } from '@/lib/markdown/preprocess-columns';
import { splitColumnFence } from '@/lib/markdown/preprocess-columns';
import {
  preprocessComponentBlocks,
  splitBlockFence,
} from '@/lib/markdown/preprocess-blocks';
import {
  parseYouTubeShortId,
  preprocessYouTubeShorts,
} from '@/lib/markdown/youtube-shorts';
import { parseSoundCloudUrl, preprocessSoundCloud } from '@/lib/markdown/soundcloud';
import { useDarkTheme } from '@/hooks/use-dark-theme';
import ColumnsLayout from './ColumnsLayout';
import ComponentHost from './markdown/ComponentHost';
import { AudioPlaybackProvider } from './audio/AudioPlaybackContext';
import AudioPlayer, { isAudioHref, titleFromAudioHref } from './audio/AudioPlayer';
import SoundCloudEmbed from './SoundCloudEmbed';
import YouTubeShortsRow from './YouTubeShortsRow';
import 'katex/dist/katex.min.css';

const MermaidBlock = dynamic(() => import('./MermaidBlock'), { ssr: false });
const PlotlyBlock = dynamic(() => import('./PlotlyBlock'), { ssr: false });

interface MarkdownBodyProps {
  content: string;
  /** When false, nested column blocks are left untouched (used inside ColumnsLayout). */
  preprocessColumnBlocks?: boolean;
  /** When false, `::: component` fences are left untouched (used inside block components). */
  preprocessComponentBlocks?: boolean;
}

function textFromChildren(children: ReactNode): string {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join('');
  if (typeof children === 'object' && 'props' in children) {
    return textFromChildren((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

function isAudioOnlyParagraph(children: ReactNode): boolean {
  const items = Children.toArray(children).filter((child) => {
    if (typeof child === 'string') return child.trim() !== '';
    return true;
  });
  return (
    items.length > 0 &&
    items.every((child) => isValidElement(child) && child.type === AudioPlayer)
  );
}

function shortIdsFromParagraph(children: ReactNode): string[] | null {
  const items = Children.toArray(children).filter((child) => {
    if (typeof child === 'string') return child.trim() !== '';
    return true;
  });
  if (items.length === 0) return null;

  const ids: string[] = [];
  for (const child of items) {
    if (!isValidElement(child)) return null;
    const href = (child.props as { href?: string }).href;
    const id = parseYouTubeShortId(href);
    if (!id) return null;
    ids.push(id);
  }
  return ids;
}

function soundCloudUrlsFromParagraph(children: ReactNode): string[] | null {
  const items = Children.toArray(children).filter((child) => {
    if (typeof child === 'string') return child.trim() !== '';
    return true;
  });
  if (items.length === 0) return null;

  const urls: string[] = [];
  for (const child of items) {
    if (!isValidElement(child)) return null;
    const href = (child.props as { href?: string }).href;
    const url = parseSoundCloudUrl(href);
    if (!url) return null;
    urls.push(url);
  }
  return urls;
}

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const dark = useDarkTheme();
  const match = /language-([\w-]+)/.exec(className || '');
  const lang = match?.[1];
  const code = String(children).replace(/\n$/, '');

  if (lang === 'lefolio-columns') {
    return <ColumnsLayout columns={splitColumnFence(code)} />;
  }

  if (lang === 'lefolio-block') {
    const block = splitBlockFence(code);
    if (!block) return null;
    return <ComponentHost id={block.id} content={block.body} />;
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

export function MarkdownBody({
  content,
  preprocessColumnBlocks = true,
  preprocessComponentBlocks: runComponentBlocks = true,
}: MarkdownBodyProps) {
  let prepared = preprocessSoundCloud(preprocessYouTubeShorts(content));
  if (runComponentBlocks) {
    prepared = preprocessComponentBlocks(prepared);
  }
  if (preprocessColumnBlocks) {
    prepared = preprocessColumns(prepared);
  }

  return (
    <AudioPlaybackProvider>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            if (isAudioOnlyParagraph(children)) {
              return <>{children}</>;
            }
            const shortIds = shortIdsFromParagraph(children);
            if (shortIds) {
              return <YouTubeShortsRow ids={shortIds} />;
            }
            const soundcloudUrls = soundCloudUrlsFromParagraph(children);
            if (soundcloudUrls) {
              return (
                <>
                  {soundcloudUrls.map((url) => (
                    <SoundCloudEmbed key={url} url={url} />
                  ))}
                </>
              );
            }
            return <p>{children}</p>;
          },
          div({ className, children, ...props }) {
            const classList =
              typeof className === 'string' ? className.split(/\s+/).filter(Boolean) : [];
            const shortsAttr =
              (props as { 'data-youtube-shorts'?: string })['data-youtube-shorts'] ||
              (props as { dataYoutubeShorts?: string }).dataYoutubeShorts;
            if (classList.includes('content-shorts-row') && shortsAttr) {
              return (
                <YouTubeShortsRow
                  ids={shortsAttr
                    .split(',')
                    .map((id) => id.trim())
                    .filter(Boolean)}
                />
              );
            }

            const soundcloudUrl =
              (props as { 'data-soundcloud-url'?: string })['data-soundcloud-url'] ||
              (props as { dataSoundcloudUrl?: string }).dataSoundcloudUrl;
            if (classList.includes('content-soundcloud') && soundcloudUrl) {
              return <SoundCloudEmbed url={soundcloudUrl} />;
            }

            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },
          code: CodeBlock,
          audio({ src, title }) {
            if (typeof src !== 'string' || !src) return null;
            return (
              <AudioPlayer src={src} title={typeof title === 'string' ? title : undefined} />
            );
          },
          a({ href, children, ...props }) {
            if (href && isAudioHref(href)) {
              return (
                <AudioPlayer
                  src={href}
                  title={titleFromAudioHref(href, textFromChildren(children))}
                />
              );
            }

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
    </AudioPlaybackProvider>
  );
}
