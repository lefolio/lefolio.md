'use client';

import { useCallback, useState } from 'react';
import type { MdImage } from '@/lib/markdown/parse';

interface CompareSwitchProps {
  original: MdImage;
  edited: MdImage;
  originalLabel?: string;
  editedLabel?: string;
}

export default function CompareSwitch({
  original,
  edited,
  originalLabel = 'Website',
  editedLabel = 'Markdown',
}: CompareSwitchProps) {
  const [showEdited, setShowEdited] = useState(false);

  const updateFromClientX = useCallback((clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    setShowEdited(clientX >= mid);
  }, []);

  return (
    <div
      className={`showcase-compare ${showEdited ? 'is-edited' : 'is-original'}`}
      role="img"
      aria-label={`${originalLabel} on the left, ${editedLabel} on the right — tap or move to either side to switch`}
      onPointerDown={(event) => {
        updateFromClientX(event.clientX, event.currentTarget);
      }}
      onPointerMove={(event) => {
        // Continuous hover switching on desktop; taps are handled by pointerdown.
        if (event.pointerType === 'mouse') {
          updateFromClientX(event.clientX, event.currentTarget);
        }
      }}
      onPointerLeave={(event) => {
        // Keep the tapped side on touch; only reset when the mouse leaves.
        if (event.pointerType === 'mouse') {
          setShowEdited(false);
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showEdited ? edited.src : original.src}
        alt={showEdited ? edited.alt || editedLabel : original.alt || originalLabel}
        className="showcase-compare-image"
        draggable={false}
      />
      <span className="showcase-compare-label showcase-compare-label--a">{originalLabel}</span>
      <span className="showcase-compare-label showcase-compare-label--b">{editedLabel}</span>
    </div>
  );
}
