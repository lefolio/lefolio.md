# lefolio.md / `@lefolio/engine`

Marketing site for **[LeFolio](https://lefolio.md)** and the publishable **engine** package — static sites from an Obsidian vault.

## Dual role

| Role | What |
|------|------|
| **Website** | This repo’s `Content/` + GitHub Pages deploy → https://lefolio.md |
| **npm package** | `@lefolio/engine` — CLI `lefolio` + Next runtime + built-in templates |

Consumers keep their own `Content/`; they do not fork this repo to publish a site. See [PACKAGING.md](./PACKAGING.md).

## Structure

```text
lefolio.md/
├── Content/             # this site’s vault (not published to npm)
├── scripts/             # lefolio CLI, sync, watch
├── src/                 # Next app + templates (academic, showcase, …)
├── package.json         # name: @lefolio/engine
└── .github/workflows/   # GitHub Pages deploy
```

## Preview this site locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/).

## Use the engine with other content

```bash
npx lefolio dev --content /path/to/YourContent
# or from a thin site with Content/ in cwd:
npm install @lefolio/engine   # or file:../lefolio.md while developing
npx lefolio dev
```

## Template (this site)

```yaml
template: showcase
theme:
  preset: ink
  mode: light
```

## Deploy (website)

Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys `out/` to GitHub Pages.

## Links

- Site: https://lefolio.md
- Package: `@lefolio/engine` (see PACKAGING.md)
- Org: https://github.com/lefolio

## License

MIT
