---
title: Deploy to GitHub Pages
order: 3
subtitle: basePath, Actions, and custom domains
---

## Project vs apex domain

| Hosting | `site.basePath` | Example |
|---------|-----------------|---------|
| Apex / custom domain | `""` | `https://lefolio.md` |
| `username.github.io/repo` | `"/repo"` | academic demo |

This vault is set up for **lefolio.md** with `basePath: ""`.

## Engine CI

Deploy builds run from the **engine** repository (or a thin site package that depends on it), with:

```bash
LEFOLIO_CONTENT=/path/to/lefolio.md/Content npm run build
```

Then publish the engine’s `out/` folder with GitHub Actions Pages.

Wire DNS for `lefolio.md` to GitHub Pages (or your host) once the workflow is green.
