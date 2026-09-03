---
title: A workflow I like for building editable websites
subtitle: Shipping V0 prototypes with a CMS
published: 2026-02-24
order: 1
---

*Originally posted on [r/webdevelopment](https://www.reddit.com/r/webdevelopment/comments/1w55p1m/i_found_a_workflow_that_i_like_to_build_editable/).*

---

Over the past months, I have been experimenting with static site generators and AI agents to build websites.

On one side, I wanted to be able to edit the content in Markdown, since I'm used to Markdown to gather ideas and build drafts.

On the other side, building landing pages doesn't fit very well with Markdown-based content because they use custom components, hero, call to action, testimonial sections, etc.

AI tools create those structured sections, but the content is usually in the JavaScript code or in JSON files, so it means it's not easy to edit once the agent has built the page.

So I came up with a high-level component structure on top of Markdown that allows you to design the page and make it easily editable with a headless CMS or locally with Markdown. Here is how it looks:

I would write the draft content with `:::` to mark components, then ask Claude to build the landing page by building React components for each `::: component`, and use the Markdown to fill the page content.

``` markdown
::: hero
## My Brand
### We build stuff that we care about

![Hero image](Assets/hero-image.png)

[Buy our stuff](/our-stuff)
[Learn more about us](/about-us)
:::

::: about
## Our Story

blablalbla

![Side image](Assets/about-image.png)
:::

::: testimonials
## Customer 1
### Product manager
Working with X was a real pleasure

## Customer 2
### Product manager
Working with X was a real pleasure
:::
```
The links turn into CTA buttons, and Claude can apply whatever layout I ask for, such as sections like about or testimonials.

Then I have all of the landing page content in one Markdown file that I can tweak and expose with a headless CMS such as TinaCMS, and it's rendered nicely with the custom template built by Claude.

Curious if you would find it useful.

Related: [[Getting-started]] · [[Blog/making-static-site-generators-more-accessible]] · [[Blog/obsidian-notes-to-web-pages]]
