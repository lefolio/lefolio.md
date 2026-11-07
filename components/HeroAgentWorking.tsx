'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_MESSAGES = [
  'Scaffolding lefolio site',
  'Crafting React components and content parsers',
] as const;

interface HeroAgentWorkingProps {
  onComplete: () => void;
  messages?: readonly string[];
  /** How long each status line stays visible. */
  messageMs?: number;
}

export default function HeroAgentWorking({
  onComplete,
  messages = DEFAULT_MESSAGES,
  messageMs = 1650,
}: HeroAgentWorkingProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      onCompleteRef.current();
      return;
    }

    let cancelled = false;
    let timer = 0;

    const advance = (from: number) => {
      if (cancelled) return;
      if (from >= messages.length - 1) {
        timer = window.setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, messageMs);
        return;
      }

      timer = window.setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setIndex(from + 1);
          setVisible(true);
          advance(from + 1);
        }, 220);
      }, messageMs);
    };

    advance(0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [messages, messageMs, reducedMotion]);

  return (
    <div className="showcase-hero-agent" role="status" aria-live="polite">
      <div className="showcase-hero-agent-stack">
        {messages.map((message, messageIndex) => {
          const isActive = messageIndex === index && visible;
          return (
            <div
              key={message}
              className={`showcase-hero-agent-row${isActive ? ' is-visible' : ''}`}
              aria-hidden={!isActive}
            >
              <div className="showcase-hero-agent-orb" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <p className="showcase-hero-agent-message">{message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
