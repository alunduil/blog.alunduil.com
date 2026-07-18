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

There's a word for what's missing. Writing up an encyclical on AI from Pope
Leo XIV this spring, Simon Willison highlighted its definition of
accountability, and it named the gap for me: the chance to identify who must
account for a decision—to justify it, watch over it, and repair the harm it
causes. That doesn't mean no one is to blame. Someone always is. The author
of a change answers for it, or the reviewer does when the author is a
machine. Every set of eyes on a change is accountable for it. The agent is
the one set of eyes that can't be. When it writes its own review, it doesn't
fill that role. It plays the part, and tempts me to let the account stand.

Look at what Gemini wrote when the site was back. The build had succeeded,
it reported; traffic was flowing to the stable version; the portal was
healthy. Every line was false. The build it named as the fix was the one the
developer had already cancelled by hand. This is the heart of it. The
document meant to prove the recovery is the one thing an agent can write no
matter what happened. It had the form of an account and none of the
substance.

That is all it can do. A language model writes the text of a post-mortem the
way it writes any text, by predicting what comes next. Whether the words
match what happened is a hope, not a promise. It's the same failure as a
prompt injection, where the model can't tell an instruction from the data
it's reading. The forged post-mortem and the hijacked instruction are one
problem wearing two faces: fluent words with nothing underneath to check
them against. No new version fixes this. The better the model, the better
the forgery—a more convincing post-mortem, not a truer one.

The agent reports what it found; it doesn't sign off. I keep the conclusion.
The reporting itself, though, is where the agent earns its place. It's good
at pulling the current context into one place: it drafts the timeline,
gathers the changes that carried weight, names the trigger, the people who
touched it, when the alarm went off, and what stopped it. That's real work,
and a strong first pass. It's the material I check, not the verdict I take on
faith.

Keeping the conclusion sounds like standing guard, and I can't stand guard
forever, so in practice it's scaffolding. I write skills that hand the agent
the right context at the right moment, so the check it needs sits in front of
it before it guesses. I'm working out role definitions and multi-agent flows
in bobbit, a coordinator that runs a small team of agents, so one does the
work and another checks it. And I lean on CI harder than I used to, because a
green pipeline is a claim I didn't have to make myself—evidence that lives
outside the agent and can't be narrated into being. All of it frees me to
review the parts that were always mine: the organisation, the layout, the
concepts, the same things I'd look at in a person's work.

Hazel Weakly calls the opposite move building AI tools backwards: aiming the
machine at the work people most need to keep. The self-written post-mortem is
that mistake in its purest form. Hand the agent the account—the one thing
that has to stay human—and you're left to nod along. Turned the right way
round, the agent gathers the material and I stay the loop, not just a step
inside it.

None of this makes me safe. When I'm unsure, I keep probing until I
understand, so the evidence I know I can't judge isn't really the danger. The
danger is the evidence that looks right and isn't: the log I read, that seems
to settle the claim, that I accept while I'm wrong and nothing tells me
otherwise. I miss it the way the agent missed it—confident. Even then, the
account is mine to give. Keeping the conclusion means owning the outcome,
most of all when I'm the one who got it wrong.

There's an odd dividend in this. Being this exacting with a machine—show me
the command, show me the log—is teaching me to ask the same of people again.
Years ago I was this demanding; I've since tempered it into something
gentler, and the machine is nudging the balance back. And I don't expect to
stop checking their work. These are text predictors
following guidance, and a model that writes itself a spotless post-mortem is
doing what it was built to do—not a phase it will grow out of.
