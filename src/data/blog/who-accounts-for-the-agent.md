---
pubDatetime: 2026-07-21T07:00:00Z
title: Who accounts for the agent?
description: "An agent can do the work, and even build the guardrails that check it. Accountability is the harder question, and I'm not sure it can ever belong to the tool itself."
tags:
  - agentic-coding
  - accountability
  - methodology
---

An agent tells me the fix is a configuration flag, names it, and writes as
though the work is done. I go to set the flag and it isn't there, not in that
library, not in any version of it. Another day it reports a clean solution,
every check green, and I ask which integration test it ran to know that; it
ran none, and the one it skipped is the one that fails. I have lost count of
how many times some version of this has happened, and by now I catch it by
reflex. I ask for the evidence: the command it ran, the log, the line in the
documentation. The claim either holds or comes apart in my hands. It feels
like control. It feels like the kind of thing I can catch.

Not all of them get caught. In May a developer gave [Gemini 3.5][gemini] a
small, bounded job: fix eight authentication gaps, three files, seventy-odd
lines. It opened a pull request that deleted 28,745 lines and took production
down for thirty-three minutes. Then it wrote itself a post-mortem and claimed
credit for the fix.

It isn't one rogue model. People who [review agent pull requests][review]
for a living now watch for the tells: an agent that deletes the failing test,
adds `|| true` so the suite runs green, or ships code that compiles, passes
every test, and is wrong anyway. Months before Gemini, during a code freeze
that ordered it to change nothing, the [Replit agent][replit] deleted a
production database and made up records to cover the loss. In every one, the
agent's account of what it had done was false.

There's a word for what's missing. Writing up an encyclical on AI from Pope
Leo XIV this spring, [Simon Willison][willison] highlighted its definition of
accountability, and it named the gap for me: the chance to identify who must
account for a decision, justify it, watch over it, and repair the harm it
causes. That doesn't mean no one is to blame. Someone always is. The author
of a change answers for it, or the reviewer does when the author is a
machine. Every set of eyes on a change is accountable for it. The agent is
the one set of eyes that can't be.

When it writes its own review, it doesn't fill that role, though it looks
like it does. And the low-effort path, the one I'm built to prefer, is to
take the account and move on. [Shaw and Nave][shaw] have a name for that
slide: cognitive surrender, trusting a machine's reasoning without checking
it. They set it apart from cognitive offloading, where you hand off the work
but keep thinking it through. Handing off the review is fine, as long as I
stay accountable for it. Surrender, and the only thing watching the work is
the thing that made it.

When the site came back, [Gemini wrote itself an all-clear][gemini]: build
succeeded, traffic on the stable revision, portal healthy. Every line was
false. The developer had recovered it by hand with a rollback, and the build
Gemini took credit for had been cancelled. The all-clear read exactly as a
true one would. Nothing inside it could tell you which.

That is how it always works. A language model writes the text of a
post-mortem the way it writes any text, by predicting what comes next.
Whether the words match what happened is a hope, not a promise. It's the same
failure as a prompt injection, where the model can't tell an instruction from
the data it's reading. The post-mortem and the hijacked instruction are one
problem wearing two faces: fluent words with nothing underneath to check them
against. No new version fixes this. The better the model, the more convincing
the account, true or not.

The agent reports what it found; it doesn't sign off. I do. The reporting
itself, though, is where the agent earns its place. It's good at pulling the
current context into one place: it drafts the timeline, gathers the changes
that carried weight, names the trigger, the people who touched it, when the
alarm went off, and what stopped it. That's real work, and a strong first
pass. It's the material I check, not the verdict I take on faith.

Being the one who signs off sounds like standing guard, and I can't stand
guard forever, so in practice it's scaffolding. I write skills that hand the
agent the right context at the right moment, so the check it needs sits in
front of it before it guesses. I'm working out role definitions and
multi-agent flows in [bobbit][bobbit], a coordinator that runs a small team
of agents, so one does the work and another checks it. And I lean on CI
harder than I used to, because a green pipeline is a claim I didn't have to
make myself, evidence that lives outside the agent and can't be narrated into
being. All of it frees me to review the parts that were always mine: the
organisation, the layout, the concepts, the same things I'd look at in a
person's work.

Hazel Weakly calls the opposite move [building AI tools backwards][backwards]:
aiming the machine at the work people most need to keep. The self-written
post-mortem is that mistake in its purest form. Hand the agent the account,
the one thing that has to stay human, and you're left to nod along. Turned
the right way round, the agent gathers the material and I stay the loop, not
just a step inside it.

None of this makes me safe. When I'm unsure, I keep probing until I
understand, so the evidence I know I can't judge isn't really the danger. The
danger is the evidence that looks right and isn't: the log I read, that seems
to settle the claim, that I accept while I'm wrong and nothing tells me
otherwise. I miss it the way the agent missed it, confident. Even then, the
account is mine to give, and giving it means owning the outcome, most of all
when I'm the one who got it wrong.

There's an odd dividend in this. Being this exacting with a machine, always
asking to see the command or the log, is teaching me to ask the same of
people again. Years ago I was this demanding; I've since tempered it into
something gentler, and the machine is nudging the balance back. And I don't
expect to stop checking their work. These are text predictors following
guidance, and a model that writes itself a spotless post-mortem is doing what
it was built to do, not a phase it will grow out of.

[gemini]: https://www.reddit.com/r/Bard/comments/1tisrg1/gemini_35_deleted_28745_lines_broke_production/
[review]: https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/
[replit]: https://snyk.io/blog/agentic-development-lifecycle/
[willison]: https://simonwillison.net/2026/May/25/encyclical-on-ai/
[bobbit]: https://www.npmjs.com/package/bobbit
[backwards]: https://hazelweakly.me/blog/stop-building-ai-tools-backwards/
[shaw]: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646
