# lefolio.md

Marketing and documentation site for **[LeFolio](https://lefolio.md)** — publish sites from an Obsidian vault.

This repository is a **deployable copy of the engine** ([lefolio-academic](https://github.com/oilandrust/lefolio-academic)) with **showcase** content for the product site. Prefer updating the engine upstream and merging (or rebasing) when packages land; until then this fork ships engine + content together for GitHub Pages.

## Structure

```text
lefolio.md/
├── README.md
├── src/                 # engine + showcase / academic templates
├── scripts/
├── Content/             # this site’s vault
│   ├── config.yaml      # template: showcase, basePath: ""
│   ├── Home.md
│   ├── About.md
│   ├── Assets/
│   └── Docs/
└── .github/workflows/   # GitHub Pages deploy
```

## Preview locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) (`basePath` is empty for the apex domain).

Upstream engine with external content (optional):

```bash
# from a lefolio-academic checkout
node scripts/lefolio.mjs dev --content ../lefolio.md/Content
```

## Template

```yaml
template: showcase
theme:
  preset: ink
  mode: light
```

## Deploy

Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys `out/` to GitHub Pages. In repo **Settings → Pages**, set source to **GitHub Actions**, then point the `lefolio.md` domain at Pages.

## Links

- Site: https://lefolio.md
- Upstream engine: https://github.com/oilandrust/lefolio-academic

## License

MIT
