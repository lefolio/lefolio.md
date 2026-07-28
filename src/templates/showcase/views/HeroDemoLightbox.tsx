'use client';

import { useCallback, useEffect, useState } from 'react';

interface HeroDemoLightboxProps {
  src: string;
  alt: string;
}

function gifSrcWithToken(src: string, token: number): string {
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}play=${token}`;
}

export default function HeroDemoLightbox({ src, alt }: HeroDemoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [playToken, setPlayToken] = useState(0);

  const openLightbox = useCallback(() => {
    setPlayToken((token) => token + 1);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="showcase-hero-demo-trigger"
        onClick={openLightbox}
        aria-label={`Enlarge ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="showcase-hero-demo" />
      </button>

      {open ? (
        <div
          className="showcase-hero-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
        >
          <button
            type="button"
            className="showcase-hero-lightbox-close"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={playToken}
            src={gifSrcWithToken(src, playToken)}
            alt={alt}
            className="showcase-hero-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
