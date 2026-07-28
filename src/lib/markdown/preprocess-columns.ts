const COLUMN_SEPARATOR = '\n\u001e\n';

/** True if another standalone `:::` column delimiter exists before the next block. */
function hasMoreColumnDelimiters(lines: string[], startIndex: number): boolean {
  for (let j = startIndex; j < lines.length; j += 1) {
    const trimmed = lines[j].trim();
    if (trimmed === '::: columns') return false;
    if (trimmed === ':::') return true;
  }
  return false;
}

/**
 * Parse `::: columns` blocks:
 *
 * ::: columns
 * column one
 * :::
 * column two
 * :::
 */
export function preprocessColumns(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() !== '::: columns') {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    i += 1;
    const columns: string[] = [];
    let buffer: string[] = [];

    while (i < lines.length) {
      if (lines[i].trim() === ':::') {
        columns.push(buffer.join('\n').trim());
        buffer = [];
        i += 1;

        while (i < lines.length && lines[i].trim() === '') {
          i += 1;
        }

        if (i >= lines.length || !hasMoreColumnDelimiters(lines, i)) {
          break;
        }
        continue;
      }

      if (lines[i].trim() === '::: columns') {
        break;
      }

      buffer.push(lines[i]);
      i += 1;
    }

    if (buffer.some((line) => line.trim() !== '')) {
      columns.push(buffer.join('\n').trim());
    }

    const body = columns.filter((col) => col.length > 0).join(COLUMN_SEPARATOR);
    out.push('');
    out.push('```lefolio-columns');
    out.push(body);
    out.push('```');
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function splitColumnFence(body: string): string[] {
  if (!body.trim()) return [];
  return body.split(COLUMN_SEPARATOR).map((col) => col.trim()).filter(Boolean);
}
