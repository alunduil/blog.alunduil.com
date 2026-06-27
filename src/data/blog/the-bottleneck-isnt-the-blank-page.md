---
pubDatetime: 2026-07-07T07:00:00Z
title: The Bottleneck Isn't the Blank Page
description: "The hard part of keeping a blog was never the writing. It was remembering what the week held and seeing which of it was worth telling."
tags:
  - tooling
  - writing
  - methodology
---

The hard part of keeping a blog is supposed to be the writing. You picture
the blank page, the cursor blinking in an empty file late on a Sunday, the
long hunt for something worth saying. That's the wall you brace for, the one
people blame when a blog goes quiet.

It was never my wall. From the first day I [came back to this
blog](/posts/i-built-the-machine-twice), I meant to write these posts with
Claude, not by myself. The blank page was a problem I handed off before I
ever faced it.

So my trouble ran the other way. It wasn't that I had nothing to say. It was
that I had too much, and couldn't see any of it. A week of mine is a hundred
small things: a commit here, a review there, an issue closed, a book
finished. Each one is forgettable on its own, and by Friday I've forgotten
most of them. Together they add up to something worth sharing. But I can't
hold the whole untidy pile in my head long enough to find its shape.

And the shape was always the hard part. Not how to write a post, but how to
find the one worth telling.

I'd seen this problem before, because I'd already solved it once at work.
There I keep a habit of looking back over the week, not to relive it but to
find the signal in it. I look for where I made a difference, and where my
effort went nowhere. The week already happened by the time I look. I invent
nothing. I only review what I lived but couldn't hold.

It isn't only me. Ashley Willis [wrote
about](https://github.blog/developer-skills/github/i-automated-my-job-and-it-made-me-a-better-leader/)
wiring up the same habit: an evening "Daily Wins Recap" that gathers what she
got done each day, so the small wins don't slip past unnoticed.

The blog was the same shape of problem, pointed at a different end. If
looking back could find my impact at work, it could find my stories here.

So I built a tool to do it for me. The raw material was already there.
Everything I do leaves a trace: a commit lands in a repository, a pull
request collects a review, a line gets highlighted in whatever I'm reading, a
book gets marked finished. The trail piles up even when I forget it. I only
needed a way to gather it back up.

I call it [the
digest](https://github.com/alunduil/blog.alunduil.com/tree/main/.claude/skills/digest).
Once a week it gathers everything I touched—what I did on GitHub, what I
highlighted while reading, the books and games I marked finished—into one
place. Then it clears out the noise: the duplicate commits a squash-merge
leaves behind, and the churn from branches the agents opened and closed on
their own.

On Saturday, 2026-06-27, it ran across the previous seven days. The raw
count was its own kind of answer: about two dozen pull requests and sixty-odd
issues across thirteen repositories, plus a week of reading I'd
half-forgotten. On Friday I couldn't have named a tenth of it.

What came back wasn't the pile. It was six themes, each already shaped like a
story. One was about [a kind of ratchet][ratchet]: let a model work out a
messy pattern, then distil what it learned into a plain rule that runs
without it. Another was [the quiet retirement of a small library][library]
I'd built, deprecated once the wider ecosystem absorbed its job. A third was
[a review][earthsea] of the Earthsea book I'd finished that week. I filed
four of the six as kernels that same morning, the stories pulled out of the
blur at last.

The digest writes none of this. It finds it. Each theme is still only a
kernel, a candidate, a place to start. To turn one into a post is separate
work: the review, the revision, the long back-and-forth with Claude until it
reads well to me. What it leaves me is the candidate, kept as an issue I can
pick up and work from.

So the finding works. I run the digest every Saturday, and the kernels pile
up in weekly waves. By the time I'm writing this, fifty-one have gathered in
the backlog, most of them filed over a weekend, forty-six still waiting their
turn. The blank week is a solved problem. I have more to write about than I
have time to write.

Not every run is a haul. Some Saturdays it turns up nothing worth keeping.
Most turn up a handful, and of those maybe three in five are solid enough to
file. It's still too early to know how many of the filed ones will ever
become posts.

That's where the real wall turned out to be. Not the blank page, and not the
finding. The writing is the slow part, and the real bottleneck. The honest
scoreboard shows it. Of those fifty-one kernels, the number that have grown
into published posts is, so far, zero. The one you're reading is nearly the
first.

None of that makes me want to stop running it. The digest costs me next to
nothing: a job that runs on its own each Saturday, and a few minutes to skim
what it found. The finding will always outrun the writing. I'd rather carry
the backlog than face the blank week.

There's one catch worth naming. The digest works because I leave a trail
worth reading. My weeks happen in public, in commits and issues and reviews,
with the books and articles I read logged alongside. Point the same idea at
someone whose work leaves no record and it has nothing to gather. The
pipeline could be anyone's, but the trail has to be your own: a task list, a
calendar, whatever you already leave behind.

[ratchet]: https://github.com/alunduil/blog.alunduil.com/issues/287
[library]: https://github.com/alunduil/blog.alunduil.com/issues/288
[earthsea]: https://github.com/alunduil/blog.alunduil.com/issues/290
