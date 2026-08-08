/**
 * Rewrite simple `::: component_id` … `:::` fences into a code fence
 * ReactMarkdown can catch (`lefolio-block`). `::: columns` stays in
 * preprocess-columns (internal `:::` column delimiters).
 */

const OPEN_RE = /^::: ([a-z][\w-]*)\s*$/i;

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

    // Nested `::: child` … `:::` stays inside the parent body so the child
    // component can preprocess again (code fences cannot nest).
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      const nested = OPEN_RE.exec(trimmed);
      if (nested && nested[1].toLowerCase() !== 'columns') {
        depth += 1;
        body.push(lines[i]);
        i += 1;
        continue;
      }
      if (trimmed === ':::') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          break;
        }
        body.push(lines[i]);
        i += 1;
        continue;
      }
      body.push(lines[i]);
      i += 1;
    }

    out.push('');
    out.push('```lefolio-block');
    out.push(id);
    out.push(body.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''));
    out.push('```');
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
