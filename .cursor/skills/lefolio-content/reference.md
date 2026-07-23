# Content reference

## Site config keys

| Key | Purpose |
|-----|---------|
| `site.title` | Browser tab + sidebar footer |
| `site.description` | SEO meta description |
| `site.url` | Canonical site URL |
| `site.basePath` | GitHub Pages subpath (`/repo-name` or `""`) |
| `home` | Homepage markdown path relative to content dir |
| `template` | Template id (`academic`) |
| `theme` | Preset, mode, overrides |
| `vault` | Obsidian vault root (relative or absolute) |
| `author.*` | Sidebar profile |
| `navigation` | Navbar entries |
| `analytics.google` | GA4 measurement ID (`G-XXXXXXXXXX`); core layout injects gtag when set |

## Author link keys

Supported in sidebar: `email`, `orcid`, `googlescholar`, `github`, `linkedin`.

Avatar path resolves via vault root (e.g. `Assets/profile.jpg`).

## Navigation formats

```yaml
# Auto-detect section folder or top-level .md
navigation:
  - Projects
  - CV

# Explicit page path
navigation:
  - Guide: "Pages/Guide.md"

# Map syntax
navigation:
  Projects:
  Guide: Pages/Guide.md
```

## Section display modes

| `display` | Best for | Shows |
|-----------|----------|-------|
| `list` | Publications (text) | Title, date, venue |
| `publication_thumbnail` | Publications (visual) | Thumbnail + metadata |
| `grid` | Projects | Card with thumbnail, title, subtitle |

## Sort modes (section index)

| `sort` | Behavior |
|--------|----------|
| `date` | Newest first; uses `date`, `start_date`, `end_date` |
| `order` | Lower `order` frontmatter first |
| `title` | Alphabetical |

## Project frontmatter (grid)

```yaml
---
title: Project name
subtitle: Short tagline
start_date: 2025-08-01
tech: react, typescript
thumbnail: preview.png
live_url: https://...
github_url: https://github.com/...
image_layout: featured
---
```

## URL routing

| File | URL |
|------|-----|
| `Content/About.md` (home) | `{basePath}/` |
| `Content/CV.md` | `{basePath}/CV/` |
| `Content/Projects/My Project.md` | `{basePath}/Projects/my-project/` |
| `permalink: custom` | `{basePath}/Section/custom/` |

## External content vault

For Obsidian vault = content folder directly (no `Content/` wrapper):

```bash
node scripts/lefolio.mjs dev --content ~/Documents/MySite
```

`config.yaml` lives at vault root. `VAULT_ROOT` equals `CONTENT_DIR` unless parent vault is configured.

## Common embed issues

| Symptom | Fix |
|---------|-----|
| `Missing embed: lefolio-academic/Content/...` | Vault root not detected — set `vault:` or `--vault` |
| `Missing embed: photo.png` | File not in vault or wrong basename |
| Thumbnail works, embed fails | Thumbnail used content-relative hack — ensure vault resolution |
| Asset stale after move | Run sync (purges `public/content-assets/` each sync) |
