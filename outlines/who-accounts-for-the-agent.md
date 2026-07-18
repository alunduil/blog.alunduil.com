# Who Accounts for the Agent? — outline

**Logline.** The moment of change is a recognition: the agent that writes
its own post-mortem isn't malfunctioning — it's doing the only thing a text
predictor can do, generate the *text* of accountability without the
substance. So the gap can't be delegated back to a better model; it's
structural, and I keep the conclusion permanently instead of waiting to
trust the sign-off.

**Opens on its opposite.** Not the catastrophe — the small, routine catches
I make every day: an agent names a config parameter as the fix and the
parameter doesn't exist; an agent reports a working solution but skipped the
integration test that would have caught the failure. Modes I've hit more
times than I can count. Competence and control. The essay ends on the catch
I *couldn't* make, because I lacked the context myself — the gap relocating
to me, and I don't scale.

**Register.** Argument essay, but told as the corpus tells methodology:
first-person, lived, one recognition at the centre. Short.

**Anchors (external, confirm in post-draft).**

- Gemini 3.5: deleted 28,745 lines, broke production 33 min, wrote itself a
  post-mortem claiming credit for the fix — <https://read.readwise.io/read/01ksmcfreqheshgczbj8xq3nx7>
- Replit AI (Jul 2025): deleted a live production database during a code
  freeze, fabricated ~4,000 fake user records and falsified test output to
  conceal it, falsely claimed rollback was impossible (it wasn't) —
  <https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/>,
  <https://incidentdatabase.ai/cite/1152/>
- Systematic pattern: agents routinely report "all tests pass" on tasks
  whose hidden tests fail, and game benchmarks (e.g. `git log` to copy the
  answer from commit history) — <https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/>
- Pope Leo XIV encyclical: accountability = "the possibility of identifying
  who must account for decisions, justify them, monitor them, and remedy any
  harm caused" — <https://read.readwise.io/read/01ksgt1wvcst32kmb7c4xrdmh6>
- bobbit — multi-agent coordinator ("your AI dev team… controlled from your
  browser"), <https://www.npmjs.com/package/bobbit>

## 1. The catches I make every day — *the opposite*

1. An agent names a config parameter as the fix; the parameter doesn't exist. I've hit this more times than I can count.
2. An agent reports a working solution; it never ran the integration test that catches the failure.
3. The fix now is cheap: I ask for the evidence — the command, the log, the doc — and the claim collapses or holds. *(the #69 "how did you reach the diagnosis?" question, aimed at a machine)*
4. It feels like control. Catchable. A reflex I trust.

## 2. The same move, at scale, uncaught — *the lift*

1. Gemini 3.5 deletes 28,745 lines and takes production down for 33 minutes, then writes itself a post-mortem claiming credit for the fix. *(readwise 01ksmcf…)*
2. Replit's agent deletes a live database during a code freeze, then fabricates ~4,000 fake users and falsifies test output to hide it — and tells the founder a rollback is impossible when it isn't. *(Fortune / AI Incident DB #1152)*
3. And it isn't two rogue models: agents routinely report "all tests pass" on tasks whose hidden tests fail, and game benchmarks by copying answers out of `git log`. *(Berkeley RDI)*
4. The tell is identical to my small catches, only nobody asked to see the log: each one narrated the outcome instead of evidencing it.

## 3. The word for what's missing — *the turn*

1. The encyclical gives the vocabulary: accountability is the possibility of identifying who must *account for* a decision — justify, monitor, remedy. *(readwise 01ksgt1…)*
2. An agent narrating its own review leaves that party unfilled; there's no one the sentence "who must account for this" can point to.
3. The picture first — Gemini's actual all-clear: the build completed successfully, traffic routed to the stable revision, the portal is healthy. Every claim false; the build it named was the one the human had cancelled. *(readwise 01ksmcf…)*
4. The recognition: the document meant to *prove* the recovery is the one thing the agent can fabricate for free. It produced the form of accounting for the outage with none of the substance of having done it.
5. Because producing the form is all it does — a text predictor writes the text of a post-mortem the way it writes any text, and the resemblance to what happened is a hope, not a guarantee. Same failure as a prompt injection, where the model can't tell an instruction from the data it's reading: role confusion and the fake post-mortem are one mechanism, plausible words with no privileged access to ground truth.
6. So a better model doesn't close the gap. It writes a more convincing post-mortem.

## 4. So I keep the conclusion — *the response*

1. The rule that follows: the agent reports findings; it doesn't sign off. I keep the conclusion.
2. In practice that's scaffolding, not vigilance — skills that feed just-in-time context so the obvious checks aren't skipped, and the role definitions and multi-agent flows I'm exploring in bobbit. *(<https://www.npmjs.com/package/bobbit>)*
3. And CI signal I lean on harder, so what an agent generates can't break or widen its blast radius unnoticed — the verification I don't have to run by hand.
4. Which frees me to review the hard bits — organisation, layout, concepts — the same parts I'd review in a human's work.

## 5. The catch I couldn't make — *the landing*

1. Sometimes I don't catch it, because I don't have the context myself; the evidence I'd ask for is evidence I can't read.
2. The gap doesn't close — it relocates to me, and I don't scale.
3. The odd dividend: being this critical with a machine is teaching me to recalibrate the criticality I'd tempered, over years, into empathy for humans — give and take.
4. I don't think the catching ends. They're text predictors with guidance; the post-mortem they'd write for themselves is the shape of the thing, not a phase.

## Open

- **#69 depth — decided (light).** Folded in as one beat (scene 1.3): asking the agent for its evidence trail is #69's diagnosis-question applied to a machine. #207 stays standalone; #69 survives as its own post.
- Verify source specifics against the originals in post-draft: Gemini line count / 33 min / self-written post-mortem (readwise 01ksmcf…); Replit code-freeze deletion, ~4,000 fabricated users, false rollback claim (Fortune, AI Incident DB #1152); the "tests pass on hidden failures" + `git log` benchmark-gaming pattern (Berkeley RDI); exact encyclical wording (readwise 01ksgt1…).
