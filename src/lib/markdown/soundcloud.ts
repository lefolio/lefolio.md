const SOUNDCLOUD_URL_RE =
  /^https?:\/\/(?:(?:www|m)\.)?soundcloud\.com\/\S+$|^https?:\/\/on\.soundcloud\.com\/\S+$/i;

/** Return a SoundCloud track/set/short URL, or null. */
export function parseSoundCloudUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim().replace(/[),.;:!?>]+$/g, '');
  if (!SOUNDCLOUD_URL_RE.test(trimmed)) return null;
  return trimmed;
}

/**
 * Extract a SoundCloud URL from a markdown source line that is only a URL
 * or a markdown link to one.
 */
export function parseSoundCloudLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const mdLink = trimmed.match(/^\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/);
  if (mdLink) return parseSoundCloudUrl(mdLink[2]);

  const angle = trimmed.match(/^<(https?:\/\/[^>\s]+)>$/);
  if (angle) return parseSoundCloudUrl(angle[1]);

  return parseSoundCloudUrl(trimmed);
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Replace standalone SoundCloud URL lines with embed placeholders.
 */
export function preprocessSoundCloud(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const url = parseSoundCloudLine(line);
    if (!url) {
      out.push(line);
      continue;
    }
    out.push('');
    out.push(
      `<div class="content-soundcloud" data-soundcloud-url="${escapeHtmlAttr(url)}"></div>`
    );
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
