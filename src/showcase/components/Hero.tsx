'use client';

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import {
  extractFirstImage,
  extractLinks,
  firstHeading,
  paragraphs,
  stripHeading,
  stripImages,
} from '@lefolio/engine/parse';
import { AccentedText } from '../lib/accented';
import HeroDemoLightbox from '../views/HeroDemoLightbox';
import HeroAgentWorking from './HeroAgentWorking';
import HeroMarkdownTypewriter from './HeroMarkdownTypewriter';

type HeroPhase = 'typing' | 'working' | 'fading' | 'ready';

/** Persist across visits in the same browser (not only the tab session). */
const INTRO_PLAYED_KEY = 'lefolio.heroIntro.played';

function hasPlayedIntro() {
  try {
    return localStorage.getItem(INTRO_PLAYED_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroPlayed() {
  try {
    localStorage.setItem(INTRO_PLAYED_KEY, '1');
  } catch {
    // ignore
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Hero({ content }: MarkdownBlockProps) {
  const image = extractFirstImage(content);
  const title = firstHeading(content);
  const kicker = firstHeading(stripHeading(content, title), 3);
  let rest = stripImages(stripHeading(content, title));
  rest = stripHeading(rest, kicker);
  const actions = extractLinks(rest);
  const lead = paragraphs(rest).find((block) => !block.startsWith('[')) ?? '';

  const rawSource = useMemo(
    () => `::: hero\n${content.replace(/^\n+|\n+$/g, '')}\n:::\n`,
    [content],
  );

  // SSR + first paint show the final hero (never an empty shell). Before paint,
  // switch to typing only when this browser has not seen the intro yet.
  const [phase, setPhase] = useState<HeroPhase>('ready');
  const [playId, setPlayId] = useState(0);

  useLayoutEffect(() => {
    if (hasPlayedIntro() || prefersReducedMotion()) {
      setPhase('ready');
      return;
    }
    setPhase('typing');
  }, []);

  // If fade animationend never fires (reduced-motion CSS, browser quirks), still settle.
  useLayoutEffect(() => {
    if (phase !== 'fading') return;
    const timer = window.setTimeout(() => {
      markIntroPlayed();
      setPhase('ready');
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const finishIntro = useCallback(() => {
    markIntroPlayed();
    setPhase('ready');
  }, []);

  const onTypingComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'typing') return current;
      if (prefersReducedMotion()) {
        markIntroPlayed();
        return 'ready';
      }
      return 'working';
    });
  }, []);

  const onAgentComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'working') return current;
      // Persist as soon as the intro content is done — don't wait for fade end.
      markIntroPlayed();
      return 'fading';
    });
  }, []);

  const skipIntro = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  const replayIntro = useCallback(() => {
    setPlayId((id) => id + 1);
    setPhase('typing');
  }, []);

  const introActive = phase === 'typing' || phase === 'working' || phase === 'fading';

  return (
    <section
      className={`showcase-hero${introActive ? ' is-intro' : ''}`}
      id="top"
      suppressHydrationWarning
      onClick={introActive ? skipIntro : undefined}
      title={introActive ? 'Click to skip' : undefined}
    >
      {phase === 'ready' ? (
        <button
          type="button"
          className="showcase-hero-replay"
          onClick={(event) => {
            event.stopPropagation();
            replayIntro();
          }}
          title="Replay introduction"
          aria-label="Replay introduction"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      ) : null}

      <div className="showcase-container showcase-hero-inner">
        <div
          className={`showcase-hero-stage${
            phase === 'fading' || phase === 'working' ? ' is-crossfading' : ''
          }`}
        >
          {phase === 'typing' ? (
            <div className="showcase-hero-intro">
              <HeroMarkdownTypewriter
                key={`type-${playId}`}
                source={rawSource}
                onComplete={onTypingComplete}
              />
            </div>
          ) : null}

          {phase === 'working' ? (
            <div className="showcase-hero-intro is-agent">
              <HeroAgentWorking key={`agent-${playId}`} onComplete={onAgentComplete} />
            </div>
          ) : null}

          {phase === 'fading' || phase === 'ready' ? (
            <div
              className={`showcase-hero-rendered${phase === 'fading' ? ' is-fading-in' : ''}`}
              onAnimationEnd={(event) => {
                if (
                  phase === 'fading' &&
                  event.target === event.currentTarget &&
                  String(event.animationName).includes('showcase-hero-fade-in')
                ) {
                  finishIntro();
                }
              }}
            >
              <div className="showcase-hero-top">
                <div className="showcase-hero-copy">
                  {title ? (
                    <h1 className="showcase-hero-title">
                      <AccentedText text={title} />
                    </h1>
                  ) : null}
                  {lead ? (
                    <div className="showcase-hero-lead">
                      <MarkdownBody
                        content={lead}
                        preprocessColumnBlocks={false}
                        preprocessComponentBlocks={false}
                      />
                    </div>
                  ) : null}
                  {kicker ? (
                    <div className="showcase-hero-kicker">
                      <MarkdownBody
                        content={kicker}
                        preprocessColumnBlocks={false}
                        preprocessComponentBlocks={false}
                      />
                    </div>
                  ) : null}
                </div>

                {actions.length > 0 ? (
                  <div className="showcase-hero-actions">
                    {actions.map((action, index) => (
                      <a
                        key={action.href + action.text}
                        href={action.href}
                        className={
                          index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'
                        }
                        {...(/^https?:/i.test(action.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {action.text}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              {image ? (
                <div className="showcase-hero-media">
                  <HeroDemoLightbox
                    src={image.src}
                    alt={image.alt || 'lefolio.md live preview'}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
