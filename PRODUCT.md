# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: makers and creators who want a personal, portfolio, or docs site and prefer editing content in Obsidian (Markdown) rather than a hosted CMS.

They care about owning files on disk, shipping a static site (e.g. GitHub Pages) without monthly hosting bills, and staying productive with templates plus optional help from a coding agent.

Academics are not the primary audience for this marketing surface (even though the engine can still serve academic-style sites).

## Product Purpose

**lefolio.md** is the public marketing and documentation site for **LeFolio**: software that turns an Obsidian-friendly Markdown vault into a static website using selectable templates.

Success for this surface: visitors understand the workflow, trust that they can publish without a CMS subscription, and take a next step (fork/clone, docs, subscribe, or contact).

## Positioning

Obsidian-first Markdown → static site, with usable templates and open-source ownership — not a locked-in website builder and not “edit HTML by hand.”

Differentiation visitors should feel: content stays local (vault + Markdown), publishing is static/cheap, templates carry the design, and coding agents can extend style/layout when needed.

## Operating Context

- Content for this site lives in `lefolio.md/Content/` (`config.yaml`, Markdown, Assets).
- Engine + templates ship in the same Next.js app (`npm run dev` / static export for GitHub Pages).
- Showcase template (`template: showcase`, ink dark) is the current marketing look.
- Related engine and sample sites exist elsewhere in the Academic workspace; this PRODUCT.md scopes **only** the lefolio.md marketing site.

## Capabilities and Constraints

- Static export (`output: 'export'`); no server-side CMS.
- Site config via `Content/config.yaml` (template, theme, navigation, analytics).
- Built-in templates (including showcase); theme presets and optional `theme.overrides`.
- Markdown features used on the site include embeds, columns, and standard prose.
- Newsletter signup via Buttondown embed on the home page.
- Open decisions for future product design (not decided here): custom non-core templates as a first-class path; in-dev theme exploration panel (see wiki `Design/dev_theme_panel.md`).

## Brand Commitments

- Product / site name: **LeFolio.md** / **LeFolio**.
- Logo assets: `Content/Assets/lefolio_logo_min.png` (and related logo files).
- Voice on the site: practical, maker-oriented, Obsidian-positive; founder voice on About (Olivier).
- Do not invent customers, testimonials, pricing tiers, or benchmark claims not present in content.

## Evidence on Hand

- Live positioning and feature copy: `Content/Home.md`, `Content/Docs/`, `Content/About.md`.
- Demo media: `Content/Assets/live_update_showcase.gif`.
- Logo / brand images under `Content/Assets/`.
- Public repo: https://github.com/lefolio/lefolio.md · site URL: https://lefolio.md
- No independent press kit or third-party case studies in-repo; do not fabricate them.

## Product Principles

1. **Vault-first truth** — content and config in the Obsidian-friendly vault are the source of truth for the site.
2. **Static ownership** — publish as static files; visitors should never need a paid host to use LeFolio’s promise.
3. **Template carries craft** — layout and look come from templates; marketing should show that without implying a locked design tool.
4. **Honest claims only** — only document workflows, features, and links that exist in the product or content.
5. **Makers over niches** — speak to creators shipping personal/portfolio/docs sites; don’t center academia on this surface.
