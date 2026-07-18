---
pubDatetime: 2026-08-02T07:00:00Z
title: Reversibility Is the Filter
description: "A guardrail I wrote to keep a coding agent from doing what I couldn't undo turned out to be the decision test I'd used on teams for years."
tags:
  - agentic-coding
  - decision-making
---

On the last day of April I added a rule to `~/.claude/CLAUDE.md`, the
global guide every one of my coding-agent sessions loads before it
touches anything, on any project. Reversible work—editing a file,
running the tests, building the site—it could do on its own and tell me
after. Anything I
couldn't take back it had to stop and ask for first: force-pushing,
rewriting history, deleting a branch, a deployment, dropping data. I wrote
that list out by hand, because those were the moves that don't come back,
and I wanted the machine to hesitate where I would.

It wasn't a theory of decisions. It was a short lead. An agent moves fast
and doesn't feel the drop the way I do, and a fast thing kept close stays
clear of the ledges. I wasn't naming a principle that afternoon—I
was closing off one particular way of getting hurt, and then I went back
to the actual work.

The rule was for the agent, but the test inside it wasn't. I kept meeting
it where the agent never reached. In May I had a small tool of my own, a
bash script for moving between git worktrees, growing steadily toward the
size where you reach for a real language. I could see the Rust rewrite
coming and nearly started it. Instead I wrote the choice down and made
myself argue the other side: bash to Rust is a walk you can take at any
time, and Rust to bash is one almost nobody makes. Rewriting early would
carry me through a one-way door before I had a reason to. So I kept the
script, and wrote down the conditions that would tell me when to port it.

The same question sat one level up, in the rule I use to decide what even
earns an architecture decision record. Most choices don't earn one; they
come apart cleanly, and a sentence in a commit message keeps them. The
ones worth the ceremony set a precedent, pin a dependency, or otherwise
cost too much to take back. Hard to reverse was the whole test. I was
running it on the agent's actions, on my own tools, and on which of my
decisions were worth writing down. I still hadn't seen it was one test,
or thought to give it a name.

I shadowed the `gh` command on my own machine so a coding agent couldn't
open a pull request for review. It could draft one all day; the version
that pings a human and starts the clock needed my hand on it. Drafting is
reversible—you close the tab and it's gone. A pull request marked ready
has already reached someone, and you can't call it back. The agent worked
right up to the edge of the outward-facing thing and stopped there. It was
the short lead again, tied off at the same place.

Then I drew the same line around myself. The blog deploys on every push
to its main branch, so I split the work in two: pull requests build and
check and prove themselves, and only the push that lands ever ships to
anyone. I didn't lay it out that cleanly at the start. I found where the
line belonged the hard way, from a dependency bump that passed every
check, merged green, and only fell over on the deploy afterwards, when
the site was already going out. Nothing was lost that a fix couldn't
recover, but on a side project the recovery is entirely mine: no reviewer
had caught it, no process had stopped it, and no one else was going to
clean it up. That's the difference from work, where a bad decision meets
other people before it meets me. Here it met an afternoon I'd set aside to
build the next thing, and I spent that afternoon fixing the last one
instead. The deploy took an hour to put right. What the hour actually cost
was some of the appetite to keep going, and on a project like this that
appetite is the only fuel there is. A bad call doesn't spend a schedule or
a budget here. It spends the will the whole thing runs on.

From the outside this all looks like fussing—elaborate care lavished on a
hobby that could get by with far less. It isn't. It's rehearsal. The other
thing I've been building, a companion site for a game I play, keeps a
record of what each player owns, and I hold it to rules I'd normally
associate with a job. A release can't quietly drop a field, or tighten a
type, or start requiring something that used to be optional, because any
of those would make data already saved on someone's account fail to load.
Once a schema is published at a version, that version is frozen; a change
ships as a new one, and the old one stays exactly as it was. A check runs
on every release and refuses anything that narrows what's already stored.

That's the same judgement I'm paid to exercise at work, where it goes by
names like API versioning and backward compatibility—only here I practice
it where the stakes are small. A wrong call on the companion site costs me
a weekend of migration and an apology to a handful of players. The same
wrong call in a system a team depends on can cost that team a quarter. So
the side project earns its keep twice: once as the thing itself, and once
as a cheap place to be wrong. The decisions I fumble here are the ones
I'll have to get right at work, where being wrong is dear. Every reversible
rep here buys a steadier hand at the one-way doors there.

In late May I read an essay by Ian Duncan that handed me the word for it.
He calls the decisions too costly to undo concave, and argues those are
the ones worth your best thinking; the rest you can afford to get wrong
and then fix. That was my rule exactly—the short lead I'd tied for the
agent—only he set down as a principle what I'd written as a precaution.
With a name on it, the separate rules fell together. The agent's
guardrail, the tool I wouldn't rewrite, the deploy I held back, the
careful versioning I do at work: not four habits that happened to rhyme,
but one question asked in four places. How hard is this to undo? I had
been answering it everywhere and had never seen it was the same question.

Duncan's fourth question asks whether the people who live with a decision
can see its shape the way you do. On a project that's mostly me and a
machine, it bends into a stranger one: whether the shape I see is real.
Before I commit to something hard to undo, I lean on the agent to tell me
how hard—what the migration takes, who else depends on this, whether the
thing I'm touching is load-bearing. The gate only works if that reading is
right. And the agent that makes me fast is the one I trust to draw the map.

Two things vary, on their own: whether the agent's read is right, and
whether I can tell. Three of the four I can live with. If it reads right
and I know it, we go. If it reads wrong and I catch it, we fix it. If it
reads right and I doubt it, the doubt costs me only time. The fourth is the
one that bites. The map is wrong and I can't tell. It's a one-way door
drawn as a two-way one, and I walk through it sure I can come back.

Teaching the agent Duncan's words would sharpen the map. It wouldn't close
the gap, because a sharper wrong map still reads as right. And some of what
I can't tell is no one's fault—the ground is rougher than any honest map
can show. So the hole in the method is every case where I can't tell, and I
have no reliable way out. The test sizes how much I should deliberate. It
can't tell me when the shape itself is the thing I've got wrong.
