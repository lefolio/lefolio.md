'use client';

import { useId, useRef } from 'react';
import { useAudioPlayback } from './AudioPlaybackContext';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const id = useId();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playback = useAudioPlayback();

  const label = title?.trim() || undefined;

  return (
    <span className="content-audio">
      {label ? <span className="content-audio-title">{label}</span> : null}
      <audio
        ref={audioRef}
        className="content-audio-element"
        controls
        preload="metadata"
        src={src}
        onPlay={() => {
          const el = audioRef.current;
          if (el && playback) playback.notifyPlay(id, el);
        }}
      >
        <a href={src}>{label || src}</a>
      </audio>
    </span>
  );
}

const AUDIO_EXT_RE = /\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i;

export function isAudioHref(href: string | undefined): boolean {
  if (!href) return false;
  const pathOnly = href.split(/[?#]/)[0] || '';
  try {
    return AUDIO_EXT_RE.test(decodeURIComponent(pathOnly));
  } catch {
    return AUDIO_EXT_RE.test(pathOnly);
  }
}

export function titleFromAudioHref(href: string, fallback?: string): string | undefined {
  if (fallback?.trim()) return fallback.trim();
  const pathOnly = href.split(/[?#]/)[0] || '';
  let decoded = pathOnly;
  try {
    decoded = decodeURIComponent(pathOnly);
  } catch {
    /* keep raw */
  }
  const base = decoded.split('/').pop() || '';
  const withoutExt = base.replace(AUDIO_EXT_RE, '');
  return withoutExt.replace(/[_-]/g, ' ').trim() || undefined;
}
