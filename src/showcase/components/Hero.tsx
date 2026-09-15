'use client';

import { useCallback, useLayoutEffect, useState, type ReactNode } from 'react';
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
import LiveMarkdownTransform from './LiveMarkdownTransform';

type HeroPhase = 'typing' | 'working' | 'live';

/** Persist across visits in the same browser (not only the tab session). */
const INTRO_PLAYED_KEY = 'lefolio.heroIntro.played';

/** Demo markdown typed beside the live hero (not the page's own hero body). */
const DEMO_SOURCE = `::: hero
# My Brand
## We build stuff that we care about

![Hero image](Assets/hero-image.png)

[Buy our stuff](/our-stuff)
[Learn more about us](/about-us)
:::
`;

/** Sample used by the live markdown ↔ preview transform after the agent lines. */
const LIVE_SOURCE = `::: hero
## My Brand
### We build stuff that we care about

[Buy our stuff](/our-stuff)
[Learn more about us](/about-us)
:::
`;

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

  // Default to the looping live demo (return visits / SSR). Before paint, start
  // the typing prelude only on a first visit without reduced motion.
  const [phase, setPhase] = useState<HeroPhase>('live');
  const [playId, setPlayId] = useState(0);

  useLayoutEffect(() => {
    if (hasPlayedIntro() || prefersReducedMotion()) {
      setPhase('live');
      return;
    }
    setPhase('typing');
  }, []);

  const skipToLive = useCallback(() => {
    markIntroPlayed();
    setPhase('live');
  }, []);

  const onTypingComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'typing') return current;
      if (prefersReducedMotion()) {
        markIntroPlayed();
        return 'live';
      }
      return 'working';
    });
  }, []);

  const onAgentComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== 'working') return current;
      markIntroPlayed();
      return 'live';
    });
  }, []);

  const replayIntro = useCallback(() => {
    setPlayId((id) => id + 1);
    setPhase('typing');
  }, []);

  const canSkipPrelude = phase === 'typing' || phase === 'working';

  const renderedHero = (
    <div className="showcase-hero-rendered">
      <div className="showcase-hero-top">
        <div className="showcase-hero-copy">
          {title ? (
            <h1 className="showcase-hero-title">
              <AccentedText text={title} palette="green" />
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
                className={index === 0 ? 'showcase-cta-primary' : 'showcase-cta-secondary'}
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
          <HeroDemoLightbox src={image.src} alt={image.alt || 'lefolio.md live preview'} />
        </div>
      ) : null}
    </div>
  );

  let introContent: ReactNode = null;
  if (phase === 'typing') {
    introContent = (
      <HeroMarkdownTypewriter
        key={`type-${playId}`}
        source={DEMO_SOURCE}
        onComplete={onTypingComplete}
      />
    );
  } else if (phase === 'working') {
    introContent = (
      <HeroAgentWorking key={`agent-${playId}`} onComplete={onAgentComplete} />
    );
  } else {
    introContent = (
      <LiveMarkdownTransform
        key={`live-${playId}`}
        code={LIVE_SOURCE}
        className="is-hero-intro"
      />
    );
  }

  return (
    <section
      className={`showcase-hero${canSkipPrelude ? ' is-intro' : ''}`}
      id="top"
      suppressHydrationWarning
      onClick={canSkipPrelude ? skipToLive : undefined}
      title={canSkipPrelude ? 'Click to skip' : undefined}
    >
      {phase === 'live' ? (
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
        <div className="showcase-hero-stage is-intro-split">
          <div
            className={`showcase-hero-intro${phase === 'working' ? ' is-agent' : ''}${
              phase === 'live' ? ' is-live' : ''
            }`}
          >
            {introContent}
          </div>

          {renderedHero}
        </div>
      </div>
    </section>
  );
}
