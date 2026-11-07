import type { StandalonePage as StandaloneNote } from '@lefolio/engine/content';
import ShowcaseContentPage from './ShowcaseContentPage';

export default function StandalonePage({
  page,
}: {
  page: StandaloneNote;
}) {
  return <ShowcaseContentPage page={page} />;
}
