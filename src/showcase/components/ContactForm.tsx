'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { MarkdownBody } from '@lefolio/engine/markdown';
import type { MarkdownBlockProps } from '@lefolio/engine/template';
import { useSiteConfig } from '../lib/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm({ content }: MarkdownBlockProps) {
  const config = useSiteConfig();
  const [status, setStatus] = useState<Status>('idle');
  const [topic, setTopic] = useState('');
  const endpoint = config?.contact?.form?.trim() ?? '';
  const email = config?.contact?.email?.trim() ?? '';
  const intro = content.trim();

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('topic') ?? '';
    setTopic(value);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get('_gotcha') ?? '').trim()) return;

    const subject = topic ? `${topic} — lefolio.md` : 'Message from lefolio.md';
    if (!endpoint) {
      if (!email) return;
      const body = [data.get('message'), '', data.get('name'), data.get('email')]
        .filter((line) => line !== null && String(line).trim())
        .join('\n');
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    data.set('_subject', subject);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="page-contact">
      {intro ? (
        <div className="page-contact-intro">
          <MarkdownBody content={intro} preprocessColumnBlocks={false} preprocessComponentBlocks={false} />
        </div>
      ) : null}
      {status === 'sent' ? (
        <p className="page-contact-status" role="status">
          Thanks, your message is on its way. I usually reply within a couple of days.
        </p>
      ) : (
        <form className="page-contact-form" onSubmit={onSubmit}>
          <div className="page-contact-row">
            <label className="page-contact-field">
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label className="page-contact-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          {topic ? (
            <label className="page-contact-field">
              <span>About</span>
              <input name="topic" type="text" value={topic} readOnly />
            </label>
          ) : null}
          <label className="page-contact-field">
            <span>Message</span>
            <textarea name="message" rows={6} required />
          </label>
          <input
            name="_gotcha"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="page-contact-trap"
            aria-hidden="true"
          />
          {status === 'error' ? (
            <p className="page-contact-status page-contact-status--error" role="alert">
              The message could not be sent.
              {email ? (
                <>
                  {' '}
                  Write to <a href={`mailto:${email}`}>{email}</a> instead.
                </>
              ) : null}
            </p>
          ) : null}
          <button type="submit" className="showcase-cta-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </section>
  );
}
