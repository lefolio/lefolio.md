---
name: lefolio-content
description: >-
  Edit LeFolio content vaults: config.yaml, markdown, Obsidian wikilinks and
  embeds, sections, frontmatter, --content and --vault paths. Use when editing
  Content/, adding pages, publications, projects, or fixing missing embeds.
---

# LeFolio Content

## Two roots (critical)

| Root | Purpose | Example |
|------|---------|---------|
| **Content dir** (`CONTENT_DIR`) | Pages, `config.yaml`, sync scan | `lefolio-academic/Content` |
| **Vault root** (`VAULT_ROOT`) | Wikilink/embed resolution (Obsidian) | `~/Projects/Academic` |

When the Obsidian vault is wider than the site content folder, embed paths are **vault-relative**:

```markdown
![[lefolio-academic/Content/Projects/LeFolio/before_after.png]]
```

Also works: `![[before_after.png]]` (note-relative) or `![[Projects/LeFolio/before_after.png]]` (content-relative).

### Vault root resolution

Precedence: `--vault` > `LEFOLIO_VAULT` > `config.yaml vault:` > auto-detect (walk up from content dir until `.obsidian/` found) > content dir itself.

```yaml
# config.yaml — relative to content folder
vault: ../..
```

```bash
node scripts/lefolio.mjs dev --content ./Content --vault ~/Projects/Academic
```

## CLI

```bash
node scripts/lefolio.mjs sync|dev|build [--content <path>] [--vault <path>]
```

| Env var | Purpose |
|---------|---------|
| `LEFOLIO_CONTENT` | Site content folder |
| `LEFOLIO_VAULT` | Obsidian vault root |

Default content: `Content/` inside the engine repo.

## Folder structure

```text
Content/
├── config.yaml
├── About.md              # top-level page or homepage
├── CV.md
├── Assets/               # images (skipped as section)
├── Pages/
│   └── Guide.md
├── Projects/
│   ├── Projects.md       # section index (same name as folder)
│   └── My Project.md
└── Publications/
    ├── Publications.md
    └── paper.md
```

- Each subfolder (except `Assets/`, `.obsidian/`) is a **section**
- Section index note: `SectionName/SectionName.md` — body shown above listing; frontmatter controls display
- Top-level `.md` files become pages at `/{filename}/`

## config.yaml essentials

```yaml
site:
  title: "Your Name"
  description: "Short description"
  url: "https://username.github.io/repo-name"
  basePath: "/repo-name"    # "" for username.github.io

template: academic
theme:
  preset: slate
  mode: light

home: "About.md"
vault: ../..                # optional

author:
  name: "Your Name"
  avatar: "Assets/profile.jpg"
  links:
    email: "you@example.edu"
    github: "https://github.com/..."

navigation:
  - Projects
  - Publications
  - CV
  - Guide: "Pages/Guide.md"

analytics:
  google: "G-XXXXXXXXXX"   # optional GA4 measurement ID
```

## Frontmatter

### Page fields

| Field | Purpose |
|-------|---------|
| `title` | Display title (default: filename) |
| `date` | Sort key for listings |
| `order` | Manual sort (lower = first) |
| `permalink` | URL slug override |
| `published: false` | Keep in vault, exclude from site |
| `thumbnail` | Card image (path, filename, or `[[wikilink]]`) |

### Section index (`Projects/Projects.md`)

```yaml
---
title: Projects
sort: date              # date | order | title
display: grid           # list | grid | publication_thumbnail
---
```

### Publication page

```yaml
---
title: Paper title
authors: [A. Author, B. Coauthor]
venue: Journal, 2024
date: 2024-06-01
thumbnail: preview.png
---
```

Thumbnail fallback: explicit field → first image embed → first sibling image (prefers `0_*` filenames).

## Markdown features

Processed at **sync time** in `scripts/sync-content.mjs`:

| Syntax | Example |
|--------|---------|
| Wikilinks | `[[brdf]]`, `[[Publications/paper\|Label]]` |
| Image embeds | `![[photo.jpg\|200\|left\|wrap]]` |
| Math | `$inline$`, `$$block$$` (KaTeX) |
| Mermaid | ` ```mermaid ` fenced block |
| Plotly | ` ```plotly ` JSON block |
| GFM | tables, strikethrough, task lists |

Embed params: width (number), `left`/`right`/`center`, `wrap` (float).

## Asset resolution

`scripts/resolve-asset.mjs` resolves in order:

1. Vault-absolute path
2. Note-relative to source file
3. Content-relative fallback
4. Basename index on full vault

Copies to `public/content-assets/<vault-relative-path>` in the engine (not in vault).

## Watch scope

`scripts/watch-content.mjs` watches **only `CONTENT_DIR`**. Assets outside content (but inside vault) resolve on sync; trigger resync by editing any content file.

## Rules

**Do:**
- Keep markdown + yaml + media in the vault
- Set `published: false` for drafts
- Place shared images in `Assets/` or beside the note

**Do not:**
- Commit `public/content-assets/`, `.content/`, `.next/`, `out/`
- Put engine code (`src/`, `package.json`) in the vault
- Expect hot reload for files outside `CONTENT_DIR`

## Verification

```bash
npm run sync-content
```

Check `.content/manifest.json` for `processedBody` and `assets` keys. Missing embeds appear as `*[Missing embed: ...]*`.

## See also

- [reference.md](reference.md) — full config and frontmatter tables
- Skill `lefolio-deploy` — basePath and GitHub Pages
- `Content/Pages/Guide.md` — user-facing guide (published on site)

## Conventions

- Engine root: `lefolio-academic/`; default content: `Content/`
- Build artifacts stay in engine: `.content/`, `public/content-assets/`, `out/`, `.next/`
- Run `npm run sync-content` before debugging manifest/asset issues
