import { describe, expect, it } from '@jest/globals';
import { collectLocalTemplates } from './collect-local';

const base = {
  id: 'demo',
  routing: 'multipage' as const,
  Shell: () => null,
  loadStyles: async () => undefined,
};

describe('collectLocalTemplates', () => {
  it('reads template, templates, default, and *Template exports', () => {
    const a = { ...base, id: 'a' };
    const b = { ...base, id: 'b' };
    const c = { ...base, id: 'c' };
    const d = { ...base, id: 'd' };

    const found = collectLocalTemplates({
      template: a,
      templates: [b],
      default: c,
      saloTemplate: d,
      noise: 1,
    });

    expect(found.map((t) => t.id).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('dedupes by id with later exports winning within the scan order', () => {
    const first = { ...base, id: 'x', Shell: () => null };
    const second = { ...base, id: 'x', Shell: () => null };
    const found = collectLocalTemplates({
      template: first,
      saloTemplate: second,
    });
    expect(found).toHaveLength(1);
    expect(found[0].Shell).toBe(second.Shell);
  });

  it('accepts client-reference Shell objects (RSC)', () => {
    const clientShell = { $$typeof: Symbol.for('react.client.reference') };
    const found = collectLocalTemplates({
      template: { ...base, Shell: clientShell },
    });
    expect(found).toHaveLength(1);
    expect(found[0].id).toBe('demo');
  });
});
