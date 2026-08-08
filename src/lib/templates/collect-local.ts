import type { TemplateModule } from './types';

/** Server Components may see client `Shell` as a reference object, not a function. */
function isComponentLike(value: unknown): boolean {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

function isTemplateModule(value: unknown): value is TemplateModule {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    isComponentLike(t.Shell) &&
    typeof t.loadStyles === 'function' &&
    (t.routing === 'multipage' || t.routing === 'singlepage')
  );
}

/**
 * Collect TemplateModule exports from a site-local `./src` entry
 * (`template`, `templates`, default, or `*Template` named exports).
 */
export function collectLocalTemplates(mod: Record<string, unknown>): TemplateModule[] {
  const found: TemplateModule[] = [];

  if (Array.isArray(mod.templates)) {
    for (const item of mod.templates) {
      if (isTemplateModule(item)) found.push(item);
    }
  }

  if (isTemplateModule(mod.template)) found.push(mod.template);
  if (isTemplateModule(mod.default)) found.push(mod.default);

  // CJS/webpack interop: namespace may nest real exports under default.
  const nested = mod.default;
  if (nested && typeof nested === 'object' && !isTemplateModule(nested)) {
    const inner = nested as Record<string, unknown>;
    if (isTemplateModule(inner.template)) found.push(inner.template);
    if (Array.isArray(inner.templates)) {
      for (const item of inner.templates) {
        if (isTemplateModule(item)) found.push(item);
      }
    }
    for (const [key, value] of Object.entries(inner)) {
      if (/Template$/.test(key) && isTemplateModule(value)) found.push(value);
    }
  }

  for (const [key, value] of Object.entries(mod)) {
    if (key === 'templates' || key === 'template' || key === 'default') continue;
    if (/Template$/.test(key) && isTemplateModule(value)) {
      found.push(value);
    }
  }

  const byId = new Map<string, TemplateModule>();
  for (const t of found) {
    byId.set(t.id, t);
  }
  return [...byId.values()];
}
