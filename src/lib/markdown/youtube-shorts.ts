const YOUTUBE_SHORT_RE =
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})\/?(?:[?#][^\s]*)?$/i;

/** Parse a YouTube Shorts URL into its video id. */
export function parseYouTubeShortId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(YOUTUBE_SHORT_RE);
  return match?.[1] ?? null;
}

/**
 * Extract a short id from a markdown source line that is only a short URL
 * or a markdown link to one: `[label](https://youtube.com/shorts/…)`.
 */
export function parseYouTubeShortLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const mdLink = trimmed.match(/^\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/);
  if (mdLink) return parseYouTubeShortId(mdLink[2]);

  const angle = trimmed.match(/^<(https?:\/\/[^>\s]+)>$/);
  if (angle) return parseYouTubeShortId(angle[1]);

  return parseYouTubeShortId(trimmed);
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Replace consecutive YouTube Shorts URL lines with a side-by-side embed row.
 * Blank lines between shorts still count as one row.
 */
export function preprocessYouTubeShorts(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const id = parseYouTubeShortLine(lines[i]);
    if (!id) {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    const ids: string[] = [id];
    let j = i + 1;

    while (j < lines.length) {
      const peek = lines[j].trim();
      if (peek === '') {
        let k = j + 1;
        while (k < lines.length && lines[k].trim() === '') k += 1;
        if (k < lines.length && parseYouTubeShortLine(lines[k])) {
          j += 1;
          continue;
        }
        break;
      }

      const nextId = parseYouTubeShortLine(lines[j]);
      if (!nextId) break;
      ids.push(nextId);
      j += 1;
    }

    out.push('');
    out.push(
      `<div class="content-shorts-row" data-youtube-shorts="${escapeHtmlAttr(ids.join(','))}"></div>`
    );
    out.push('');
    i = j;
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
