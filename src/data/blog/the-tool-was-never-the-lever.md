---
pubDatetime: 2026-06-30T07:00:00Z
title: The Tool Was Never the Lever
description: "Three site generators in twelve years, one new post. Building the machinery was always easier than writing—until agents made it cheap enough to stop hiding in."
tags:
  - tooling
  - methodology
---

In May 2026 I replaced [Hakyll] with [AstroPaper] in [one pull
request][migration]. It deleted a whole toolchain—a `.cabal` file, a
Nix derivation, a Cloud Build pipeline, a Dockerfile, a Travis CI
file—and thirty-eight posts with it. The commit message gives a reason:

> …the blog has been dormant since 2018 and the toolchain no longer
> fits.

That's the tempting version: a tool stopped fitting, so I replaced it. I
wrote that line myself, and I believed about half of it. It was the
third time I'd replaced the tool, and the git log keeps a less
flattering record than the message does.

## How it works now

Today a post is a Markdown file. I open it, write, and add a few lines
of frontmatter at the top—a title, a date, a tag or two. When it's done
I commit it and push to `main`, and a GitHub Actions workflow builds the
site and puts it live. [Renovate] watches the dependencies and opens a
pull request whenever one drifts, so the stack stays current without my
attention. Claude drafts beside me and runs the toolchain when I'd
rather not.

The distance between having something to say and having it live is a
text file and a `git push`. It's light enough now to make me wary. For
years it was anything but—and the rest of this is why, and what I was
doing instead.

## Three generators, one post

The repository begins in 2014, on [Nikola]. The early posts—Gentoo,
running servers, the OpenStack work—didn't start life in 2014. They're
imports, written years earlier on something I genuinely can't recall.
Long ago there was a hand-rolled HTML site with a bit of PHP. Once
static site generators arrived, that's where my head went, and the path
before them has gone hazy. The 2014 commit just gathered the old posts
into Nikola.

In March 2017 I added a Cloud Build pipeline and a Travis CI file. Days
later I tore out Nikola and stood up Hakyll—a Haskell generator, with
the GHC, Cabal, and Nix scaffolding that comes with it. I changed themes
more than once. The log remembers a zen-ipython theme, then a switch to
material. Each one felt like a fresh start that would finally take. A
`default.nix` and a `.cabal` file followed in 2018, then version-cap
bumps and direnv commits into 2020.

Across twelve years I published one new post: [How I
Read](/posts/how-i-read), in 2018. I started one more, a 2017 draft on
backing up with Bacula, and never shipped it. Two engine migrations, a
from-scratch deploy pipeline, and a single post to show for the
machinery.

## What I was doing instead

I told myself the blog was between tools. That wasn't it. I no longer
wanted to manage the machinery of a blog, and I didn't have a stack that
stayed out of the way. So I let the machinery stand in for the work.
Configuring Hakyll, picking a theme, getting it to look right—that felt
like progress on the blog. It was the part of blogging that isn't
writing, and I did it instead of writing.

There was a plainer reason underneath. I was writing a great deal for
work in those years, and the personal posts never got the energy left
over. After a day of writing for someone else, the blog asked for the
one resource I'd already spent. The stack made a convenient alibi—more
interesting to fix than a blank page, and never finished. A blog I'm
forever about to relaunch is a blog I never have to write for.

## What changed

What changed last year wasn't a better generator. It was how I work. I
moved most of my programming to agentic tools, and—as Martin Fowler has
put it—they put the fun back in. The machinery I used to disappear into
got cheap. Claude builds the design around the content, where I once
spent a week on a generator's theme. The theme is someone else's to
maintain now, not mine. The operational work that used to be a project
is a prompt.

That's the cage door swinging open. The pull was never toward the
writing, or toward the programming under my software—it was toward
building the system for the writing, the system for the software. The
machinery was the part I enjoyed, so the machinery was where I went.
When agents made it cheap, the fun drained out of the fiddling, and the
only thing left worth doing was the writing.

---

There's a catch to all this. Look at what I did with the fun agents
handed back: I built a pipeline. A writing pipeline—reading-level
linters, a drafting routine, a ghostwriter. This post came out of it.
From one angle that's the same move again, the machinery in fresh paint,
and I'd be a fool to miss it.

I've run enough production systems to have the SRE line reflexive: hope
is not a strategy. I'll say it anyway. This time the machine produced
the thing instead of deferring it—you're reading the output, not the
scaffolding. With no strategy and a sample size of one, I'm hopeful it's
different this time.

[Hakyll]: https://jaspervdj.be/hakyll/
[AstroPaper]: https://github.com/satnaing/astro-paper
[migration]: https://github.com/alunduil/blog.alunduil.com/pull/49
[Renovate]: https://docs.renovatebot.com/
[Nikola]: https://getnikola.com/
