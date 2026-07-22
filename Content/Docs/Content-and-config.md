---
title: Content and config
order: 2
subtitle: Structure of a LeFolio content vault
---

## Layout

```text
Content/
├── config.yaml
├── Home.md
├── About.md
├── Assets/
│   └── lefolio_logo.png
└── Docs/
    ├── Docs.md              # section index
    └── Getting-started.md
```

## Essential config

| Key | Purpose |
|-----|---------|
| `site.url` / `site.basePath` | Canonical URL and GitHub Pages subpath |
| `template` | `showcase` or `academic` |
| `theme` | Preset + mode + optional overrides |
| `home` | Markdown file for `/` |
| `navigation` | Top nav labels and targets |
| `author.avatar` | Logo or portrait (showcase uses this in the header and hero) |

## Markdown features

Wikilinks, image embeds (`![[…]]`), math, Mermaid, and Plotly are processed at sync time. See the Guide in the academic demo content for full examples.
