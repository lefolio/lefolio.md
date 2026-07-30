'use client';

import { useEffect, useState } from 'react';

interface SoundCloudEmbedProps {
  url: string;
}

type EmbedState =
  | { status: 'loading' }
  | { status: 'ready'; src: string; height: number; title?: string }
  | { status: 'error' };

function playerFromOembed(html: string, fallbackUrl: string, height: number) {
  const srcMatch = html.match(/\ssrc="([^"]+)"/i);
  let src = srcMatch?.[1]?.replace(/&amp;/g, '&') ?? '';

  if (src) {
    if (/[?&]visual=true\b/.test(src)) {
      src = src.replace(/([?&])visual=true\b/, '$1visual=false');
    } else if (!/[?&]visual=/.test(src)) {
      src += `${src.includes('?') ? '&' : '?'}visual=false`;
    }
  } else {
    const params = new URLSearchParams({
      url: fallbackUrl,
      visual: 'false',
      show_artwork: 'true',
      hide_related: 'true',
      show_comments: 'false',
      show_teaser: 'false',
    });
    src = `https://w.soundcloud.com/player/?${params.toString()}`;
  }

  return { src, height: height > 0 ? height : 166 };
}

export default function SoundCloudEmbed({ url }: SoundCloudEmbedProps) {
  const [state, setState] = useState<EmbedState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const endpoint = new URL('https://soundcloud.com/oembed');
    endpoint.searchParams.set('format', 'json');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('maxheight', '166');

    fetch(endpoint.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`oEmbed ${res.status}`);
        return res.json() as Promise<{ html?: string; height?: number; title?: string }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data.html) throw new Error('missing html');
        const player = playerFromOembed(data.html, url, Number(data.height) || 166);
        setState({
          status: 'ready',
          src: player.src,
          height: player.height,
          title: data.title,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (state.status === 'error') {
    return (
      <p className="content-soundcloud content-soundcloud--fallback">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </p>
    );
  }

  if (state.status === 'loading') {
    return (
      <div
        className="content-soundcloud content-soundcloud--loading"
        aria-busy="true"
        aria-label="Loading SoundCloud player"
      />
    );
  }

  return (
    <div className="content-soundcloud">
      <iframe
        title={state.title || 'SoundCloud'}
        width="100%"
        height={state.height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay; encrypted-media"
        src={state.src}
        loading="lazy"
      />
    </div>
  );
}
