'use client';

import { FormEvent, useState } from 'react';
import type { MarkdownBlockProps } from '@/lib/markdown/components/types';
import { firstHeading, prepareSaloMarkdown, stripHeadings } from '../lib/parse';

export default function Newsletter({ content }: MarkdownBlockProps) {
  const prepared = prepareSaloMarkdown(content);
  const title = firstHeading(prepared, 2) || firstHeading(prepared);
  const lead = stripHeadings(prepared);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setDone(true);
  }

  return (
    <section className="salo-newsletter" data-component="newsletter">
      <div className="salo-container salo-newsletter-inner">
        {title ? <h2 className="salo-section-title">{title}</h2> : null}
        {lead ? <p className="salo-section-lead">{lead}</p> : null}
        {done ? (
          <p className="salo-newsletter-thanks">Thanks for subscribing!</p>
        ) : (
          <form className="salo-newsletter-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="salo-newsletter-email">
              Email
            </label>
            <input
              id="salo-newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="salo-newsletter-input"
            />
            <button type="submit" className="salo-btn salo-btn-primary">
              Subscribe
            </button>
          </form>
        )}
        <p className="salo-newsletter-legal">
          By subscribing, you agree to our terms and privacy policy.
        </p>
      </div>
    </section>
  );
}
