/** Convert a human-readable name into a URL-safe slug (lowercase, hyphens). */
export function slugify(name: string): string {
  return name
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
