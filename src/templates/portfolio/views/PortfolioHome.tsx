import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { ContentManifest } from '@/lib/content/types';

interface PortfolioHomeProps {
  manifest: ContentManifest;
}

function findSection(manifest: ContentManifest, name: string) {
  return manifest.sections.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

function findNavHref(manifest: ContentManifest, label: string) {
  return (
    manifest.navigation.find((item) => item.label.toLowerCase() === label.toLowerCase())
      ?.href || null
  );
}

export default function PortfolioHome({ manifest }: PortfolioHomeProps) {
  const { home, config, authorAvatar } = manifest;
  const author = config.author;
  const role = author?.bio || 'Educator, Coach and Entrepreneur';
  const trainings = findSection(manifest, 'Trainings');
  const blog = findSection(manifest, 'Blog');
  const coachingHref = findNavHref(manifest, 'Coaching') || '/Coaching/';
  const trainingsHref = findNavHref(manifest, 'Trainings') || '/Trainings/';
  const blogHref = findNavHref(manifest, 'Blog') || '/Blog/';

  return (
    <>
      <section className="portfolio-hero">
        <div className="portfolio-container portfolio-hero-row">
          <div className="portfolio-hero-copy">
            <p className="portfolio-eyebrow">Profile</p>
            <h1>{author?.name || config.site.title}</h1>
            <p className="portfolio-hero-role">{role}</p>
            {config.site.description ? (
              <p className="portfolio-hero-lead">{config.site.description}</p>
            ) : null}
          </div>
          {authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={authorAvatar}
              alt={author?.name || config.site.title}
              className="portfolio-hero-avatar"
            />
          ) : null}
        </div>
      </section>

      <div className="portfolio-container">
        <section className="portfolio-section" id="about">
          <p className="portfolio-eyebrow">About</p>
          <h2>{home?.title || 'About'}</h2>
          {home?.processedBody ? (
            <MarkdownRenderer content={home.processedBody} />
          ) : (
            <p className="text-muted">Configure `home` in config.yaml.</p>
          )}
        </section>

        {trainings && trainings.pages.length > 0 ? (
          <section className="portfolio-section" id="trainings">
            <p className="portfolio-eyebrow">Trainings</p>
            <h2>Training offerings</h2>
            <ul className="portfolio-card-list">
              {trainings.pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="portfolio-card">
                    <h3>{page.title}</h3>
                    {page.subtitle ? <p>{page.subtitle}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="portfolio-cta-row">
              <Link href={trainingsHref} className="portfolio-cta-ghost">
                View all trainings
              </Link>
            </div>
          </section>
        ) : null}

        <section className="portfolio-section" id="coaching">
          <p className="portfolio-eyebrow">Coaching</p>
          <h2>One-to-one coaching</h2>
          <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: '36rem' }}>
            Structured coaching for educators, founders, and operators who want clearer
            priorities and steadier progress.
          </p>
          <div className="portfolio-cta-row">
            <Link href={coachingHref} className="portfolio-cta">
              Coaching services
            </Link>
            {blog ? (
              <Link href={blogHref} className="portfolio-cta-ghost">
                Read the blog
              </Link>
            ) : null}
          </div>
        </section>

        {blog && blog.pages.length > 0 ? (
          <section className="portfolio-section" id="blog" style={{ paddingBottom: '3.5rem' }}>
            <p className="portfolio-eyebrow">Blog</p>
            <h2>Recent writing</h2>
            <ul className="portfolio-entry-list">
              {blog.pages.slice(0, 2).map((page) => (
                <li key={page.href}>
                  <Link href={page.href}>
                    <h2>{page.title}</h2>
                    {page.subtitle ? <p className="portfolio-meta">{page.subtitle}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
