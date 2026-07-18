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
clean it up. That is the difference from work, where a bad decision meets
other people before it meets me. Here it met an afternoon I'd set aside to
build the next thing, and I spent that afternoon fixing the last one
instead. The deploy took an hour to put right. What the hour actually cost
was some of the appetite to keep going, and on a project like this that
appetite is the only fuel there is. A bad call doesn't spend a schedule or
a budget here. It spends the will the whole thing runs on.
