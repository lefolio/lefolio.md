import Link from 'next/link';
import type { ContentManifest, SectionListItem } from '@/lib/content/types';

interface HomeViewProps {
  manifest: ContentManifest;
}

const INTEREST_ORDER = ['software', 'music', 'transformation'] as const;

function interestRank(page: SectionListItem) {
  const key = page.slug.toLowerCase();
  const idx = INTEREST_ORDER.indexOf(key as (typeof INTEREST_ORDER)[number]);
  if (idx >= 0) return idx;
  const order = page.frontmatter?.order;
  return typeof order === 'number' ? 100 + order : 999;
}

export default function HomeView({ manifest }: HomeViewProps) {
  const interestsSection = manifest.sections.find(
    (section) => section.name.toLowerCase() === 'interests'
  );
  const interests = [...(interestsSection?.pages ?? [])].sort(
    (a, b) => interestRank(a) - interestRank(b)
  );

  return (
    <section className="treasure-home">
      {interests.length === 0 ? (
        <p className="text-muted">
          Add interest pages under <code>Content/Interests/</code> (Software, Music,
          Transformation) with a <code>thumbnail</code> image.
        </p>
      ) : (
        <ul className="treasure-interests">
          {interests.map((page, index) => {
            const solo = interests.length === 3 && index === 2;
            return (
              <li
                key={page.href}
                className={solo ? 'treasure-interest--solo' : undefined}
              >
                <Link href={page.href} className="treasure-interest-card">
                  <div className="treasure-interest-shot">
                    {page.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.thumbnail} alt="" />
                    ) : (
                      <div className="treasure-interest-shot-empty">
                        Add thumbnail image
                      </div>
                    )}
                  </div>
                  <h2 className="treasure-interest-title">{page.title}</h2>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
