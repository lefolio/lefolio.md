---
name: LeFolio.md
description: Marketing site for LeFolio — ink-dark showcase, Obsidian-first static publishing
colors:
  primary: "#2890f8"
  primary-hover: "#4aa0ff"
  on-primary: "#0a1220"
  brand-navy: "#e8eef8"
  brand-blue: "#2890f8"
  bg: "#0a1220"
  bg-alt: "#121c2e"
  bg-elevated: "#1a2740"
  text: "#e8eef8"
  text-muted: "#9aacc4"
  border: "#2a3a55"
  ink-light-bg: "#ffffff"
  ink-light-text: "#001850"
  ink-light-primary: "#1880f8"
  ink-light-brand-navy: "#001850"
typography:
  display:
    fontFamily: "Outfit, Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Outfit, Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.8vw, 1.85rem)"
    fontWeight: 700
    lineHeight: 1.45
  title:
    fontFamily: "Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  full: "9999px"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
  input-email:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.85rem"
  nav-link:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
---

# Design System: LeFolio.md

## Overview

**Creative North Star: "Ink on Deep Water"**

The marketing site sits in a deep navy-ink field. Surfaces step quietly lighter as they rise; a single electric blue — sampled from the LeFolio logo — is the signal for links, brand extension (`.md`), and the primary CTA. Typography is practical system UI for reading, with Outfit reserved for the brand wordmark and hero title so the product name feels intentional without turning the page into a display-font showcase.

Density is spacious: wide home measure, generous section gaps, hero as one composition (demo + brand + one CTA). Product truth leads — demo GIF, vault workflow, honest copy — not decorative chrome.

**Confirmed rejections:** purple-on-white / indigo SaaS gradients; warm cream + terracotta editorial cliché; broadsheet hairline / dense newspaper layouts.

**Key Characteristics:**
- Dark ink canvas with tonal surface steps (not heavy card grids)
- One accent blue used sparingly as signal
- Outfit for brand; Segoe UI / system for prose and chrome
- Soft elevation only on media and overlays
- Quiet nav; one confident primary button

## Colors

Logo-derived navy and blue, remapped for dark ink readability. Active site theme: `ink-dark` (`config.yaml`: preset ink, mode dark). `ink-light` exists as the daylight twin.

### Primary
- **Obsidian Link Blue** (`#2890f8`): Links, `.md` brand extension, primary CTA fill, hero accent on bold spans. Hover brightens to `#4aa0ff`. Text on primary is near-ink `#0a1220`.

### Neutral
- **Deep Ink** (`#0a1220`): Page background.
- **Ink Shelf** (`#121c2e`): Alternate / inset surfaces (code, form shell).
- **Raised Ink** (`#1a2740`): Elevated chrome (header mix, lightbox close, secondary buttons).
- **Paper Signal** (`#e8eef8`): Body text; also `--brand-navy` on dark so the wordmark core stays readable.
- **Mist Caption** (`#9aacc4`): Muted text and default nav.
- **Harbor Line** (`#2a3a55`): Borders and hairline dividers.

### Light twin (reference only)
- Background `#ffffff`, text/brand navy `#001850`, primary `#1880f8` — use when documenting or previewing `ink-light`, not as the marketing default.

### Named Rules
**The One Beacon Rule.** Obsidian Link Blue is for signal (link, CTA, brand `.md`, accented words) — not large fills or decorative gradients beyond the soft hero glow.

**The Ink Field Rule.** Prefer stepping `--color-bg` → `--color-bg-alt` → `--color-bg-elevated` over introducing new neutrals.

## Typography

**Display / Brand Font:** Outfit (600/700) with Avenir Next / Segoe UI fallbacks  
**Body Font:** Segoe UI / ui-sans-serif / system-ui  
**Mono Font:** ui-monospace

**Character:** Brand type is tight and confident; body type is familiar and long-form readable. No serif display pairing.

### Hierarchy
- **Display** (Outfit 700, `clamp(1.5rem, 2.5vw, 2rem)`, lh 1.15, tracking `-0.03em`): Hero brand title and nav wordmark.
- **Headline** (Outfit-weight via strong / hero description `clamp(1.25rem, 2.8vw, 1.85rem)`, lh 1.45): Hero supporting line; home `h2` prose titles use similar clamp in showcase home body.
- **Title** (`--text-h2` 1.75rem / `--text-h3` 1.25rem): Section and subsection headings in prose.
- **Body** (`--text-base` 1rem, lh 1.7): Prose and marketing copy; home content max ~60rem container.
- **Label** (~0.875–0.95rem, medium): Nav, CTA labels, form chrome.

### Named Rules
**The Brand Type Rule.** Outfit is for LeFolio naming and hero title only — not for long paragraphs.

## Layout

Full-bleed ink field; content in centered containers: site chrome `--showcase-max` (72rem), home body `--showcase-home-max` (60rem), both with `100% - 2rem` gutters. Hero is a single composition: demo/media + copy + one primary CTA; from `768px` the hero row goes horizontal. Template grid for multi-column markdown kicks in around `900px`. No persistent sidebar (`--sidebar-width: 0`).

Rhythm: hero/section padding on the order of `3–5rem` vertical; component gaps `0.75–1.5rem`.

## Elevation & Depth

**Tonal first.** Depth comes from surface steps and a soft radial primary wash in the hero. Shadows are reserved for product media and modal focus — not for every card.

### Shadow Vocabulary
- **Media rest** (`0 18px 40px` at ~8% text color mix): Hero demo frame, template shot tiles.
- **Lightbox focus** (`0 24px 64px` at ~18% text color mix): Enlarged demo image.
- **Header veil:** translucent bg mix (~92%) over content; not a hard shadow.

### Named Rules
**The Flat-By-Default Rule.** Chrome and prose sit flat. Lift only when something is media or temporarily focused (lightbox).

## Shapes

Gently rounded rectangles dominate: **0.75rem** on demo frames, form shell, template shots; **0.5rem** on buttons and inputs; **pill** only for the lightbox close control. Borders are 1px Harbor Line — structure without hairline “print” aesthetics.

## Components

### Buttons
Quiet chrome, one loud primary.
- **Shape:** Soft rectangle (`0.5rem`)
- **Primary:** Obsidian Link Blue fill, on-primary ink text, `px-5 py-2.5`, text-sm medium — used for “Fork it on GitHub”
- **Hover:** Primary hover blue; secondary gains primary-colored border/text
- **Secondary:** Elevated surface + border (available; playground CTA removed from hero)

### Inputs / Fields
Buttondown embed on home.
- **Style:** Ink field bg, Harbor border, `0.5rem` radius
- **Focus:** Primary-tinted outline + border shift
- **Shell:** Form sits in alt surface with `0.75rem` radius padding

### Navigation
Text links, muted by default; hover/active → full text color; active weight medium. Brand wordmark: navy/paper core + blue `.md` extension via Outfit.

### Cards / Containers
Template preview tiles: elevated bg, 1px border, soft media shadow, `0.75rem` radius — product shots, not content “card walls.”

### Signature: Hero demo
Demo GIF/frame is the visual anchor of the first viewport; lightbox for enlarge; slight scale on hover/focus. Do not bury the demo under floating badges or promo chips.

## Do's and Don'ts

### Do:
- **Do** keep the first viewport to brand, one headline idea, short support, one CTA, and the demo.
- **Do** use Obsidian Link Blue for links, `.md`, and the primary action only.
- **Do** step surfaces with the ink token ladder before inventing new grays.
- **Do** put product imagery (GIF, template shots) at full compositional weight.

### Don't:
- **Don't** introduce purple/indigo gradient “AI product” skins or cream+serif terracotta tropes.
- **Don't** wrap the hero demo in cards, stickers, or floating meta chips.
- **Don't** set long-form copy in Outfit.
- **Don't** treat `ink-light` tokens as the marketing default while config is ink-dark.
