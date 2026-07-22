---
title: Getting started
order: 1
subtitle: Install the engine and point it at a content vault
---

## Prerequisites

- Node.js 22+
- A folder of markdown content with a `config.yaml` (this repo’s `Content/` is an example)

## Run against this vault

From a clone of [lefolio-academic](https://github.com/oilandrust/lefolio-academic):

```bash
cd lefolio-academic
npm install
node scripts/lefolio.mjs dev --content ../lefolio.md/Content
```

Open the local URL (no `basePath` for `lefolio.md`, so usually `http://localhost:3000/`).

## Production build

```bash
node scripts/lefolio.mjs build --content ../lefolio.md/Content
```

Static files land in the engine’s `out/` directory.

## Configure the template

In `Content/config.yaml`:

```yaml
template: showcase
theme:
  preset: ink
  mode: light
```

Academic sites use `template: academic` instead.
