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

## What changed

The work changed. Last year I moved most of my programming to agentic
tools, and the fun came back—Martin Fowler has made the same point. I was
building at a pace I hadn't hit in years: ideas and workflows piling up
faster than I could use them.

![A grid of monthly GitHub contributions from 2010 to 2026: light but steady through the 2010s, then 2026 far darker than any year before it, peaking in May.](/assets/the-tool-was-never-the-lever-contributions.svg)

*My GitHub contributions by month, 2010–2026. The colour runs on a
square-root scale, so the steady years stay visible next to 2026's
spike.*

And I started wanting to show the work to someone. Not to prove
anything—just to find out whether the things I build are useful to anyone
besides me. The blog was the easiest way to write the work down and put
it where people could find it. Social media never clicked for me, and
I've never been sure how to start—so I'm starting here instead.

## Why I came back

So I came back. In May 2026 I reopened the repository, tore out the
Haskell stack, and stood up [AstroPaper] in [one pull request][migration].

It's tempting to call that the turn—a better tool, at last. It wasn't.
I'd swapped generators before, Nikola for Hakyll, and the blog stayed just
as silent. A new generator had never once started the writing. The tool
was never the lever. What changed this time had nothing to do with the
tools: I had something to say, and I wanted to say it. AstroPaper only
unlocked the door. The wanting walked me through.

## Not just the blog

It didn't stop at the blog. The same urge has me opening other things I'd
let lapse. Notes on living in git worktrees. Documenting the homelab as a
system. What the AI-coding bills come to. A backlog of book and game
reviews. There are more posts queued now than I have published in fifteen
years.

## The catch

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
[AstroPaper]: https://github.com/satnaing/astro-paper
[migration]: https://github.com/alunduil/blog.alunduil.com/pull/49
