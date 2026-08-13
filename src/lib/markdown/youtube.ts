const YOUTUBE_SHORT_PATH = /youtube\.com\/shorts\//i;

/** Parse a standard YouTube watch/share URL into a video id (not Shorts). */
export function parseYouTubeVideoId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim().replace(/[),.;:!?>]+$/g, '');
  if (!trimmed || YOUTUBE_SHORT_PATH.test(trimmed)) return null;

  const youtuBe = trimmed.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})(?:[?#]|$)/i);
  if (youtuBe) return youtuBe[1];

  const embed = trimmed.match(
    /^https?:\/\/(?:www\.|m\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})(?:[?#]|$)/i
  );
  if (embed) return embed[1];

  const legacy = trimmed.match(
    /^https?:\/\/(?:www\.|m\.)?youtube\.com\/v\/([A-Za-z0-9_-]{6,})(?:[?#]|$)/i
  );
  if (legacy) return legacy[1];

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      if (id && /^[A-Za-z0-9_-]{6,}$/.test(id)) return id;
    }
  } catch {
    // not a URL
  }

  return null;
}

/**
 * Extract a video id from a markdown line that is only a YouTube URL,
 * a link/image to one, or an autolink: `![](https://youtu.be/…)`.
 */
export function parseYouTubeVideoLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const mdImage = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/);
  if (mdImage) return parseYouTubeVideoId(mdImage[2]);

  const mdLink = trimmed.match(/^\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/);
  if (mdLink) return parseYouTubeVideoId(mdLink[2]);

  const angle = trimmed.match(/^<(https?:\/\/[^>\s]+)>$/);
  if (angle) return parseYouTubeVideoId(angle[1]);

  return parseYouTubeVideoId(trimmed);
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Replace standalone YouTube video lines with embed placeholders. */
export function preprocessYouTubeVideos(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const id = parseYouTubeVideoLine(line);
    if (!id) {
      out.push(line);
      continue;
    }
    out.push('');
    out.push(`<div class="content-youtube" data-youtube-id="${escapeHtmlAttr(id)}"></div>`);
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
