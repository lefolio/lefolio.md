---
title: Converting Obsidian notes to web pages
subtitle: What works today, what breaks, and why I built another path
published: 2025-05-18
order: 3
source_url: https://www.reddit.com/r/ObsidianMD/comments/1uoy20i/discussion_converting_obsidian_notes_to_web_pages/
source_label: r/ObsidianMD discussion
---

*Originally posted as a [discussion on r/ObsidianMD](https://www.reddit.com/r/ObsidianMD/comments/1uoy20i/discussion_converting_obsidian_notes_to_web_pages/).*

---

Somehow I’ve become quite interested in publishing technologies for Obsidian. There is something about the ease of editing Markdown, the comfort of having all the files locally, and the ability to easily convert Markdown to HTML that makes that design space appealing to me. Of course, behind that is also the desire to publish one's own thoughts, show our work, and have a dedicated, structured, and good-looking space to do that. It's about showing ourselves and our work.

Yet, most published websites based on Obsidian with tools like Obsidian Publish and static site generators such as Quartz do mostly look like an Obsidian vault, and not like a user-oriented, beautiful website such as a portfolio or a blog.

I’ve built a few portfolios (here and here) using Markdown as source, a few vibe-coded scripts, and a vibe-coded React template. I even built a portfolio hosting service based on Markdown, but failed in trying to reproduce the editing ease of Obsidian in an online editor.

Publishing Workflow
There are a couple of common solutions for converting notes or vaults into websites. Of course, there is Obsidian Publish, and a few other hosting solutions such as Forestry.md and Flowershow.app. There is Quartz, which allows you to create a static website from notes, and there are common free hosting solutions, mainly GitHub Pages. There are a few plugins to bridge the gap between notes and the final hosted site. They typically push changes to a git repo and trigger a build that makes the website available to the world.

So the pattern is mostly: push your notes to a server, trigger a build to generate a static site, and you're done.

I've built an Obsidian Plugin to publish on GitHub Pages in a single click, doing just that.

Look and Feel of the published sites
One thing I notice about all those solutions is that the output sites resemble an Obsidian vault or a Wiki: there are folders and notes on the left, links, and even a graph view on the right. While this is cool, I think it's a bit limiting and maybe misses the point. To be honest, as good as they might look, those websites often do not give a portfolio experience. And unless I am looking for information, such as a documentation website, they might not be very pleasant to visit.

A missing piece?
So I think those solutions are fine for wikis, documentation, and course notes, but lacking for building a portfolio, a project page, or a blog. But it is possible to create beautiful pages from Markdown; we just need a more structured and targeted approach, and a template that fits the use case, like my portfolios, or this example](https://namika.hmsk.co/) I found on Medium, and that looks absolutely beautiful.

What do you think?
What do you use publishing for?
Would you like to build a portfolio, a project page, or a blog, keeping your text on Obsidian but publishing with a beautiful template?
Would you rather vibe code it yourself, or use a tool like WordPress?