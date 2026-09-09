/**
 * Rewrite simple `::: component_id` … `:::` fences into a code fence
 * ReactMarkdown can catch (`lefolio-block`). `::: columns` stays in
 * preprocess-columns (internal `:::` column delimiters).
 *
 * Markdown fenced code blocks (``` … ```) are opaque: `:::` lines inside
 * them do not open/close component blocks.
 */

const OPEN_RE = /^::: ([a-z][\w-]*)\s*$/i;
const MD_FENCE_RE = /^(`{3,}|~{3,})/;

export function preprocessComponentBlocks(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const open = OPEN_RE.exec(lines[i].trim());
    if (!open || open[1].toLowerCase() === 'columns') {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    const id = open[1].toLowerCase();
    i += 1;
    const body: string[] = [];
    let depth = 1;
    let mdFence: string | null = null;

    // Nested `::: child` … `:::` stays inside the parent body so the child
    // component can preprocess again. Markdown code fences are skipped so
    // sample `:::` docs do not close the outer block early.
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (mdFence) {
        body.push(line);
        if (trimmed.startsWith(mdFence)) {
          mdFence = null;
        }
        i += 1;
        continue;
      }

      const fence = MD_FENCE_RE.exec(trimmed);
      if (fence) {
        mdFence = fence[1][0].repeat(fence[1].length);
        body.push(line);
        i += 1;
        continue;
      }

      const nested = OPEN_RE.exec(trimmed);
      if (nested && nested[1].toLowerCase() !== 'columns') {
        depth += 1;
        body.push(line);
        i += 1;
        continue;
      }
      if (trimmed === ':::') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          break;
        }
        body.push(line);
        i += 1;
        continue;
      }
      body.push(line);
      i += 1;
    }

    // Prefer a longer fence than any nested markdown fence so sample ```
    // blocks stay inside the lefolio-block body.
    let fenceLen = 3;
    for (const line of body) {
      const nestedFence = /^(`{3,})/.exec(line.trim());
      if (nestedFence) {
        fenceLen = Math.max(fenceLen, nestedFence[1].length + 1);
      }
    }
    const fence = '`'.repeat(fenceLen);

    out.push('');
    out.push(`${fence}lefolio-block`);
    out.push(id);
    out.push(body.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''));
    out.push(fence);
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Split a `lefolio-block` fence body into component id + inner markdown. */
export function splitBlockFence(code: string): { id: string; body: string } | null {
  const trimmed = code.replace(/^\n+/, '').replace(/\n+$/, '');
  if (!trimmed) return null;
  const nl = trimmed.indexOf('\n');
  if (nl === -1) {
    return { id: trimmed.trim().toLowerCase(), body: '' };
  }
  const id = trimmed.slice(0, nl).trim().toLowerCase();
  const body = trimmed.slice(nl + 1).replace(/^\n+/, '');
  if (!id) return null;
  return { id, body };
}
