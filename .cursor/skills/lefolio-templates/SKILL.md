---
name: lefolio-templates
description: >-
  Create and extend LeFolio site templates (TemplateModule API, shell, views,
  routing). Use when adding a template, porting landing/portfolio UI, editing
  SiteShell/Sidebar/SectionPageList, or changing template: in config.yaml.
---

# LeFolio Templates

## What a template is

A template is **information architecture + React shell**, not a CSS skin.

| Template | Routing | Shape |
|----------|---------|-------|
| `academic` (current) | `multipage` | Sidebar + navbar + section listings |
| `showcase` (current) | `multipage` | Top nav + hero + docs (product/marketing) |
| `landing` (planned) | `singlepage` | Hero + `##` sections + CTA |
| `portfolio` (planned) | `singlepage` | Hero + project cards |

Templates consume the **manifest** (`.content/manifest.json`) produced by sync. They must not re-parse the vault.

## TemplateModule contract

```typescript
// src/lib/templates/types.ts
interface TemplateModule {
  id: string;
  routing: 'multipage' | 'singlepage';
  Shell: React.FC<{ manifest: ContentManifest; children: React.ReactNode }>;
  loadStyles: () => Promise<unknown>; // () => import('./styles.css')
  Home?: React.FC<{ manifest: ContentManifest }>;
  SectionIndex?: React.FC<{ manifest: ContentManifest; section: NavSection }>;
  StandalonePage?: React.FC<{ manifest: ContentManifest; page: StandalonePage }>;
  ContentPage?: React.FC<{ page: ManifestPage }>;
}
```

`getTemplate(id)` fills missing view slots with engine defaults (`src/lib/templates/defaults.tsx`).
App Router routes (`page.tsx`, `[section]/page.tsx`, `[slug]/page.tsx`) only call `getTemplate` — they must not import `@/templates/*` views.
Root layout calls `await template.loadStyles()` so only the active template’s CSS is loaded (do **not** `@import` template CSS from `globals.css`).

## File layout (academic reference)

```text
src/templates/academic/
├── index.ts              # exports academicTemplate (incl. loadStyles)
├── styles.css            # entry: presets + theme.css (loaded via loadStyles)
├── theme.css             # layout tokens + prose scoped to [data-template="academic"]
├── themes/               # slate-*, latex-*, …
├── shell/
│   ├── SiteShell.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
└── views/
    └── SectionPageList.tsx   # list | grid | publication_thumbnail modes
```

## Registration

1. Implement `TemplateModule` in `src/templates/<id>/index.ts`
2. Register in `src/lib/templates/registry.ts`:

```typescript
import { landingTemplate } from '@/templates/landing';

const templates: Record<string, TemplateModule> = {
  academic: academicTemplate,
  landing: landingTemplate,
};
```

3. User selects via `config.yaml`:

```yaml
template: academic
```

Sync writes `template` to the manifest (`scripts/sync-content.mjs` via `resolveTemplateId`).

## App wiring

- **`src/app/layout.tsx`** — `getTemplate(…).Shell` wraps all pages; `await loadStyles()`; sets `data-template` on `<html>`
- **Home / section / content routes** — `getTemplate(…).Home | SectionIndex | StandalonePage | ContentPage`
- **Do not** import `@/templates/<id>/views/*` from `src/app/` — register views on the template module
- **Do not** `@import` template CSS from `globals.css` — use each template’s `styles.css` + `loadStyles`
- **Do not** keep shell components in `src/components/` — they belong under `src/templates/<id>/`

## CSS boundary

| Layer | Location | Scope |
|-------|----------|-------|
| Engine shared | `src/app/globals.css` | Figures, link utilities, Tailwind imports |
| Template CSS entry | `src/templates/<id>/styles.css` | Starts with `@reference "../../app/globals.css"`; aggregates presets + `theme.css`; loaded via `loadStyles` |
| Template structure | `src/templates/<id>/theme.css` | `[data-template="<id>"]` layout + `.prose-content` |
| Theme presets | `src/templates/<id>/themes/*.css` | `[data-theme="preset-mode"]` colors |

Do **not** `@import` template CSS from `globals.css` or from template `index.ts` (sync import would pull every registered template). Use `loadStyles: () => import('./styles.css')` only. Each `styles.css` must start with `@reference "../../app/globals.css"` so Tailwind v4 `@apply` (incl. typography utilities) resolves without duplicating Tailwind CSS.
## Workflow: add a new template

1. Create `src/templates/<id>/` with `index.ts`, `shell/`, `views/`, `theme.css`
2. Implement `Shell` — read nav, author, sections from `manifest`
3. Register in `src/lib/templates/registry.ts`
4. Add theme preset CSS files under `themes/` and import in `globals.css`
5. Wire routes in `src/app/` if routing differs from academic
6. Run `npm run build` and verify `data-template="<id>"` on `<body>`

## Rules

**Do:**
- Consume `ContentManifest` types from `src/lib/content/types.ts`
- Scope template CSS with `[data-template="<id>"]`
- Keep markdown rendering in `MarkdownRenderer` (engine), not in templates

**Do not:**
- Put React components in the content vault
- Re-parse markdown or wikilinks in template code
- Change manifest shape without updating sync + types
- Hardcode colors — use CSS tokens (see `lefolio-themes` skill)

## Verification

```bash
npm run sync-content
npm run build
```

Check generated pages use the correct shell and section display modes.

## See also

- [reference.md](reference.md) — file checklist and manifest fields templates use
- Skill `lefolio-themes` — palette/preset CSS
- Skill `lefolio-content` — vault structure and frontmatter
- Wiki: `wiki/lefolio/templates.md` — architecture rationale

## Conventions

- Engine root: `lefolio-academic/`; default content: `Content/`
- Build artifacts stay in engine: `.content/`, `public/content-assets/`, `out/`, `.next/`
- Run `npm run sync-content` before debugging manifest issues
