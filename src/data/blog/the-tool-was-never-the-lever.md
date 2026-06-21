---
pubDatetime: 2026-06-30T07:00:00Z
title: The Tool Was Never the Lever
description: "Replacing Hakyll with AstroPaper wasn't about a better static site generator. The generator was always downstream of something else: first cadence, then maintenance."
tags:
  - tooling
  - methodology
---

Commit `b7f806c` deletes a Haskell toolchain—a `.cabal` file, a Nix
derivation, a Cloud Build pipeline, a Dockerfile, a Travis CI file. It
deletes thirty-eight posts too, and replaces it all with [Astro],
pnpm, and GitHub Pages. The message says what changed. It doesn't say why. The
tempting story is that Astro is better than [Hakyll]. That story is wrong,
and the dates say so.

## How it works now

A post is a Markdown file with a frontmatter block. I write it, commit
it, and push to `main`. A GitHub Actions workflow builds the site and
publishes to GitHub Pages. [Renovate] opens pull requests when
dependencies drift. Claude drafts alongside me and runs the toolchain
when I'd rather not. The in-loop cost of publishing—the work between
having something to say and having it live—is a text file and a
`git push`.

## What stopped the writing

The posts cluster between 2010 and 2012—Gentoo, running servers,
the early OpenStack work I was doing then. Then they stop. One post
landed in 2018, [How I Read](/posts/how-i-read), and then silence
closed back over the blog for another seven years.

Hakyll can't be the reason. The version-cap bumps and the Nix and
direnv commits are all 2018 to 2020—the toolchain fuss happened during
the silence, not before it. A generator I was barely touching couldn't
have caused a gap that started six years before I started fighting with
it.

Two things actually stopped the writing. The smaller was friction at
the margin: GHC upgrades broke dependencies, and Cabal and Stack
drifted apart. Getting back to a building site was its own small
project each time I sat down. That was real, and it cost me the handful
of attempts I did make. The larger was a broken loop: no habit holding
the next post in place, and no readers on the other end making the next
one worth the activation energy. The generator was never the
binding constraint. Whatever rendered the HTML, the blog would have sat
just as quiet.

## What the migration bought

It wasn't speed. Rendering time has never been the bottleneck for a
blog that isn't publishing, and a few seconds of `cabal build` was
never what stood between me and a post.

What the migration bought was a substrate I don't maintain alone. The
old stack was bespoke—a `.cabal` only I compiled, a Cloud Build
pipeline only I ran, a Nix derivation pinning a compiler only I
upgraded. [AstroPaper] is a maintained theme with a community around
it. The parts I used to own now arrive as someone else's pull requests.
What carried forward is everything that was never the problem: it's
still git-backed, still static HTML, still served from my own domain.
The migration kept those and swapped out the part I'd been carrying by
myself.

## The part that bends this

Here is where the tidy version of the argument gets complicated. The
story so far is *lower friction won*—Markdown beat Haskell because the
in-loop cost is smaller. But the in-loop cost isn't mine to pay
anymore. Claude runs the toolchain now. It could run Hakyll as well as
it runs Astro. A `cabal build` I'd have to remember is, to Claude, the
same shape as a `pnpm build`. If friction is the whole argument, it has
mostly evaporated, and with it the case for migrating at all.

So why be on AstroPaper rather than a Hakyll I no longer have to
operate by hand? Not ergonomics—maintenance leverage. On a popular
theme I inherit other people's fixes: security patches, dependency
hygiene, the accumulated improvements of everyone running the same
code. On a bespoke stack I inherit nothing, because no one else runs
it. Staying on the less-ergonomic generator would have been the wrong
call here—but not because it's slow. Because it's solo. The cost that
matters isn't the keystrokes to publish. It's the keystrokes to keep
the thing alive, and those don't disappear when Claude joins the loop.
They move to whoever maintains the stack.

---

The generator was always downstream. In 2012 it sat below a question
about cadence—a question the build was never going to answer, because
the silence wasn't about the build. Now it sits below a question about
maintenance—which code I want to own and which I'd rather inherit. Both
times the mistake was the same: treating the tool as the lever, the
thing you pull to make the writing happen or the blog survive.

What the migration actually did wasn't fix publishing. It deleted
enough scaffolding that I could finally see the constraint had been
somewhere else the whole time.

[Astro]: https://astro.build/
[Hakyll]: https://jaspervdj.be/hakyll/
[Renovate]: https://docs.renovatebot.com/
[AstroPaper]: https://github.com/satnaing/astro-paper
