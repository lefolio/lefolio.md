# lefolio.md

Marketing site for **[LeFolio](https://lefolio.md)** — Obsidian vault + site-local **showcase** template, powered by [`@lefolio/engine`](https://github.com/lefolio/engine).

## Structure

```text
lefolio.md/
├── Content/             # this site’s vault
├── src/
│   ├── index.ts         # exports showcase TemplateModule
│   └── showcase/        # site-local template
├── package.json         # depends on @lefolio/engine
└── .github/workflows/   # GitHub Pages deploy
```

## Preview locally

```bash
# expects sibling checkout: ../lefolio (the engine)
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/).

## Template

```yaml
# Content/config.yaml
template: showcase
theme:
  preset: ink
  mode: light
```

## Deploy

Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds with the engine and deploys `out/` to GitHub Pages.

## Links

- Site: https://lefolio.md
- Engine: https://github.com/lefolio/engine
- Org: https://github.com/lefolio

## License

MIT
