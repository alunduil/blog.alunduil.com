---
pubDatetime: 2026-06-30T07:00:00Z
title: The Tool Was Never the Lever
description: "I archived this blog and meant it. What reopened it wasn't a better tool—it was agentic coding leaving me with more to share than I could keep to myself."
tags:
  - tooling
  - writing
---

The blog had been quiet a long time before I archived it. Its last sign
of life was a pair of dutiful version bumps to keep the Haskell build from
falling over, one in 2018 and one in 2020. After that, nothing. It had
been busy enough once, though busy with building more than writing. It ran
on [Nikola], then [Hakyll], gathering up a Cloud Build pipeline, a Nix
file, and a couple of theme changes along the way. In all twelve years,
that machinery had carried just one new post, [How I
Read](/posts/how-i-read). So when I went through my GitHub, closing out
projects I no longer worked on, I came to this one and barely paused. It
was cruft like the rest, and it went without ceremony. I didn't expect to
open it again.

In January I started building [genshin.dungeon.studio][genshin] from
scratch, pair-programming with an agent, and the energy came back almost
at once. It was the kind of total absorption I hadn't felt since
university, when a whole Saturday on World of Warcraft flipped into a whole
Sunday on programming, both days deep in flow. And it was fun again, the
kind Martin Fowler calls [a great lost joy of software development][fowler].
I was building at a pace I hadn't touched in years, ideas and workflows
stacking up faster than I could use them.

![A grid of weekly GitHub contributions from 2010 to 2026: light but steady through the 2010s, then a dark streak across spring 2026, far darker than any week before it.](/assets/the-tool-was-never-the-lever-contributions.svg)

*My GitHub contributions by week, 2010–2026. The colour runs on a
square-root scale, so the steady years stay visible next to 2026's
spike.*

Around then I was building a harness for my whole setup, the agents,
dotfiles, and skills wired into one loop that fed itself. I'd built it for
reuse on purpose. Each piece was written once and meant to drop unchanged
into the next thing. What I hadn't expected was how much it paid off. The
reused parts compounded, each carrying into the next. Seeing that is what
turned me toward sharing. Parts that did this much for me weren't only
mine to keep. Someone else could lift one out, or someone had already
built a better version I'd never see unless I shared mine.

I wasn't trying to build an audience, only to reach the few people who'd
find a useful part and the few who'd show me a better one. The usual road
there is social media, which has never taken for me. I've never been sure
how to start or how to keep it up. A blog asked less. It was somewhere to
set the work down and let people find it. So in May I reopened the
repository, tore out the Haskell stack, and stood up [AstroPaper] in
[one pull request][migration].

The same energy spread past the blog into everything else. I'm writing
small Haskell libraries again, working out a shared shape to build them
on. My machine's setup lives in [alunduil-chezmoi] now, with the rest of
my hosts to follow. I'm improving [zfs-replicate], which I no longer run
myself, but the NixOS community still packages. I'm standing up
[alunduil-infrastructure] as the code behind my whole home network and
personal services. None of this was new ground for me. After years of a
near-empty calendar I was building again, well before I was
writing.

And every piece of it wants writing up. There are notes on living in git
worktrees day to day, the homelab set down as a system instead of a pile
of services, a reckoning of what the AI-coding bills actually come to, and
a backlog of book and game reviews I keep meaning to clear. There are more
posts queued now than I've published in fifteen years.

None of it came from a better tool. AstroPaper is just another static-site
generator—widely used, widely forked, dozens of hands on it—and out of the
box it fits no one in particular. What fit it to my hand was the scaffolding
I built around it: a deploy that runs on every push, the DNS kept as code.
That shaping is the real thing. It's what Fowler means by crafting your
tools to [fit your metaphorical hand][reprogrammability]. But I'd done all this
before. The Haskell blog had a Cloud Build pipeline, a Nix file, a Docker
image—scaffolding I tended for years while the blog stayed silent. Shaping
the tool was never the same as filling the page. The tool was never the
lever. The drive was.

There's a catch, and I see it. This post didn't come straight from me. It
came through a machine I built to write it: an outline step, a draft step,
a reading-level check, an agent at my shoulder. I sat down to write one
post and built the pipeline first. Building it was a pleasure; writing the
post it existed to produce was the slow, grinding work. And the pleasure
is the problem: I love making systems for their own sake, and that love
doesn't know where to stop. One improvement opens onto the next, and
before long I'm polishing the machine instead of feeding it.

What's different now is that I see it happening and turn back. The machine
points at the work getting out, not at being a finer machine. The urge to
fiddle hasn't gone quiet; I just keep aiming it at the page. The post is
out, and the queue behind it is real.

[Nikola]: https://getnikola.com/
[Hakyll]: https://jaspervdj.be/hakyll/
[genshin]: https://github.com/dungeon-studio/genshin.dungeon.studio
[fowler]: https://martinfowler.com/fragments/2026-05-05.html
[reprogrammability]: https://martinfowler.com/bliki/InternalReprogrammability.html
[AstroPaper]: https://github.com/satnaing/astro-paper
[migration]: https://github.com/alunduil/blog.alunduil.com/pull/49
[alunduil-chezmoi]: https://github.com/alunduil/alunduil-chezmoi
[zfs-replicate]: https://github.com/alunduil/zfs-replicate
[alunduil-infrastructure]: https://github.com/alunduil/alunduil-infrastructure
