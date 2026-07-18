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
