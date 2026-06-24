---
pubDatetime: 2026-06-30T07:00:00Z
title: The Tool Was Never the Lever
description: "I archived this blog and meant it. What reopened it wasn't a better tool—it was agentic coding leaving me with more to share than I could keep to myself."
tags:
  - tooling
  - writing
---

I archived this blog in a cleanup. I was tidying my GitHub, closing out
repositories I no longer touched, and this one was cruft like the
rest—so it got filed away, read-only, done. No eulogy. I expected never
to open it again.

It had a past life, mostly of building rather than writing. It ran on
[Nikola], then [Hakyll], with a Cloud Build pipeline, a Nix file, and a
couple of theme changes along the way. In the twelve years the repository
existed I had published one new post, [How I Read](/posts/how-i-read).
I'm prolific when something has hold of me. This didn't, so when I tidied
up, it went.

The work changed. Last year I moved most of my programming to agentic
tools, and the fun came back—Martin Fowler has made [the same point][fowler].
I was building at a pace I hadn't hit in years: ideas and workflows piling
up faster than I could use them.

![A grid of weekly GitHub contributions from 2010 to 2026: light but steady through the 2010s, then a dark streak across spring 2026, far darker than any week before it.](/assets/the-tool-was-never-the-lever-contributions.svg)

*My GitHub contributions by week, 2010–2026. The colour runs on a
square-root scale, so the steady years stay visible next to 2026's
spike.*

And then I wanted to show the work to someone. Not to prove
anything—just to find out whether the things I build are useful to anyone
besides me. The blog was the easiest way to write the work down and put
it where people could find it. Social media never clicked for me, and
I've never been sure how to start—so I'm starting here instead.

In May 2026 I reopened the repository, tore out the Haskell stack, and
stood up [AstroPaper] in [one pull request][migration].

The same change has me building everywhere again. A stack of small
Haskell libraries. A fleet of machines run from one set of dotfiles.
Tooling to run several coding agents at once. A set of composable backup
services. After years of a near-empty calendar, the doing came back first.

Each piece wants writing up, too—a whole queue, not just this post. Notes
on living in git worktrees. Documenting the homelab as a system. What the
AI-coding bills come to. A backlog of book and game reviews. There are
more posts queued now than I have published in fifteen years.

None of it came from a better tool. A tool does have to suit the hand—Martin
Fowler writes about crafting your tools to
[fit your metaphorical hand][reprogrammability]—and AstroPaper suits mine:
Markdown, no build to babysit, a low bar to publish. That part is real. But
suiting the hand was
never the same as filling the page. I'd swapped generators before—Nikola for
Hakyll—and the blog stayed just as silent. The migration lowered the cost of
a post; it never made me want to write one. The tool was never the lever.
The desire was.

There's a catch, and I'd be a fool to miss it. To do this I built another
machine—a writing pipeline, a reading-level check, an agent drafting
beside me. This post came out of it. From one angle that's the same old
move: build the thing instead of doing the thing.

This machine points the other way, though. The old ones were places to
hide. This one exists to push the work out where someone might read it.
I've run enough production systems to have the line reflexive: hope is not
a strategy. I'm going to hope anyway. The post is out, the queue is real,
and this time it points at sharing, not hiding.

[Nikola]: https://getnikola.com/
[Hakyll]: https://jaspervdj.be/hakyll/
[fowler]: https://martinfowler.com/fragments/2026-05-05.html
[reprogrammability]: https://martinfowler.com/bliki/InternalReprogrammability.html
[AstroPaper]: https://github.com/satnaing/astro-paper
[migration]: https://github.com/alunduil/blog.alunduil.com/pull/49
