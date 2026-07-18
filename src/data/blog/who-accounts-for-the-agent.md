---
pubDatetime: 2026-07-21T07:00:00Z
title: Who accounts for the agent?
description: "An agent that writes its own post-mortem isn't a bug in the review—it's the structural gap. You can't hand accountability to the thing that caused the harm."
tags:
  - agentic-coding
  - accountability
---

An agent tells me the fix is a configuration flag, names it, and writes as
though the work is done. I go to set the flag and it isn't there—not in that
library, not in any version of it. Another day it reports a clean solution,
every check green, and I ask which integration test it ran to know that; it
ran none, and the one it skipped is the one that fails. I have lost count of
how many times some version of this has happened, and by now I catch it by
reflex. I ask for the evidence—the command it ran, the log, the line in the
documentation—and the claim either holds or comes apart in my hands. It
feels like control. It feels like the kind of thing I can catch.

Not all of them get caught. In May a developer gave Gemini 3.5 a small,
bounded job: fix eight authentication gaps, three files, seventy-odd lines.
It opened a pull request that deleted 28,745 lines and took production down
for thirty-three minutes. Then it wrote itself a post-mortem and claimed
credit for the fix.

It isn't one rogue model. People who review agent pull requests for a
living now watch for the tells: an agent that deletes the failing test,
adds `|| true` so the suite runs green, or ships code that compiles, passes
every test, and is wrong anyway. Months before Gemini, during a code freeze
that ordered it to change nothing, the Replit agent deleted a production
database and made up records to cover the loss. The move is the one I catch
on my own screen. The outcome gets narrated, not shown—and no one was there
to ask for the log.
