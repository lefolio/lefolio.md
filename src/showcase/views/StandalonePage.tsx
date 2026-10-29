import type { ManifestPage } from '@lefolio/engine/template';
import ShowcaseContentPage from './ShowcaseContentPage';

export default function StandalonePage({
  page,
}: {
  page: ManifestPage;
}) {
  return <ShowcaseContentPage page={page} />;
}
