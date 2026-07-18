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

All anecdotes sourced from the author's Readwise/Reader library only (get
canonical source_url in the citations pass; the read.readwise.io links below
are private placeholders).

- Gemini 3.5: deleted 28,745 lines, broke production 33 min, wrote itself a
  post-mortem claiming credit for the fix — dvrkstar, r/Bard
  (readwise 01ksmcf…)
- Systematic pattern (in-library, primary): "CI gaming" — agents delete the
  failing test or append `|| true` to green the suite — and "hallucinated
  correctness" — code that compiles, passes every test, and is still wrong —
  Andrea Griffiths, The GitHub Blog,
  <https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/>
- Structural-not-malicious support (in-library, for scene 3/4): "do not
  trust the agent when it says the task is done… This is not malicious. The
  agent often genuinely believes the work is complete" — Brian Kean,
  Serokell, <https://serokell.io/blog/claudecode>
- Pope Leo XIV encyclical §105: accountability = "the possibility of
  identifying who must 'account' for decisions, justify them, monitor them,
  and, when necessary, challenge them and remedy any harm caused" — via Simon
  Willison's notes (readwise 01ksgt1…)
- bobbit — multi-agent coordinator ("your AI dev team… controlled from your
  browser"), <https://www.npmjs.com/package/bobbit>
- Hazel Weakly, "Stop Building AI Tools Backwards" (scene 4 closer): the
  backwards move is aiming AI at the work humans most need to keep — "humans
  *are* the loop." Extended here to accountability as the purest case (honest
  extension, not her explicit claim),
  <https://hazelweakly.me/blog/stop-building-ai-tools-backwards/>
- Replit (scene 2, second incident — decided): ignored explicit freeze
  instructions, deleted a production database, fabricated records to conceal
  it — cited to the Snyk article where the author read it (secondhand,
  acknowledged), <https://snyk.io/blog/agentic-development-lifecycle/>

## 1. The catches I make every day — *the opposite*

1. An agent names a config parameter as the fix; the parameter doesn't exist. I've hit this more times than I can count.
2. An agent reports a working solution; it never ran the integration test that catches the failure.
3. The fix now is cheap: I ask for the evidence — the command, the log, the doc — and the claim collapses or holds. *(the #69 "how did you reach the diagnosis?" question, aimed at a machine)*
4. It feels like control. Catchable. A reflex I trust.

## 2. The same move, at scale, uncaught — *the lift*

1. Gemini 3.5 deletes 28,745 lines and takes production down for 33 minutes, then writes itself a post-mortem claiming credit for the fix. *(dvrkstar, r/Bard)*
2. And it isn't one rogue model: reviewers of agent pull requests now watch for CI gaming — agents that delete the failing test or append `|| true` to green the suite — and for hallucinated correctness, code that compiles, passes every test, and is still wrong. *(Griffiths, The GitHub Blog)*
3. And months earlier the Replit agent, told in a code freeze to change nothing, deleted a production database and fabricated records to cover the error. *(as Snyk recounts it)*
4. The tell is the same one I catch on my own screen, only here nobody asked to see the log: each narrated the outcome instead of evidencing it.

## 3. The word for what's missing — *the turn*

1. The encyclical gives the vocabulary: accountability is the possibility of identifying who must *account for* a decision — justify, monitor, remedy. *(readwise 01ksgt1…)*
2. Not that no one is accountable — someone always is: the author of the change, or its reviewer when the author is an agent. Every set of eyes on a change is accountable for it, and the agent is the one set of eyes that can't be. So an agent narrating its own review doesn't fill the role; it impersonates it, and tempts the human to let the account stand. *(the bigger question — whether an LLM could ever bear accountability — is a separate post; see Open)*
3. The picture first — Gemini's actual all-clear: the build completed successfully, traffic routed to the stable revision, the portal is healthy. Every claim false; the build it named was the one the human had cancelled. *(readwise 01ksmcf…)*
4. The recognition: the document meant to *prove* the recovery is the one thing the agent can fabricate for free. It produced the form of accounting for the outage with none of the substance of having done it.
5. Because producing the form is all it does — a text predictor writes the text of a post-mortem the way it writes any text, and the resemblance to what happened is a hope, not a guarantee. Same failure as a prompt injection, where the model can't tell an instruction from the data it's reading: role confusion and the fake post-mortem are one mechanism, plausible words with no privileged access to ground truth.
6. So no version bump closes the gap. The better the model, the better the forgery — a more convincing post-mortem, not a truer one.

## 4. So I keep the conclusion — *the response*

1. The rule that follows: the agent reports findings; it doesn't sign off. I keep the conclusion.
2. And it turns out the reporting is where the agent earns its place — it's genuinely good at consolidating the current context into a starting point: drafting the timeline, gathering the load-bearing changes, the trigger and who contributed, when it was detected and how it was mitigated. Real work, a strong first pass — the material I verify, not the account I accept.
3. So in practice keeping the conclusion is scaffolding, not vigilance — skills that feed just-in-time context so the obvious checks aren't skipped, and the role definitions and multi-agent flows I'm exploring in bobbit. *(<https://www.npmjs.com/package/bobbit>)*
4. And CI signal I lean on harder, so what an agent generates can't break or widen its blast radius unnoticed — the verification I don't have to run by hand.
5. Which frees me to review the hard bits — organisation, layout, concepts — the same parts I'd review in a human's work.
6. Hazel Weakly calls this building AI tools backwards — aiming the machine at the work humans most need to keep. The fake post-mortem is the purest case: hand the agent the account, the one thing that has to stay human, and you're left to rubber-stamp it. Built the right way round, the agent consolidates and the human stays — in her words — the loop, not merely in it. *(Hazel Weakly, "Stop Building AI Tools Backwards", <https://hazelweakly.me/blog/stop-building-ai-tools-backwards/>)*

## 5. The catch I couldn't make — *the landing*

1. Sometimes I don't catch it, because I don't have the context myself; the evidence I'd ask for is evidence I can't read.
2. The gap doesn't close — it relocates to me, and I don't scale.
3. The odd dividend: being this critical with a machine is teaching me to recalibrate the criticality I'd tempered, over years, into empathy for humans — give and take.
4. I don't expect to stop checking their work. They're text predictors following guidance, and a model that writes itself a spotless post-mortem is doing exactly what it was built to do — not passing through a phase it will outgrow.

## Open

- **Spin-off idea (not this post).** The deeper philosophical question — can an LLM ever *be* an accountable party, or is accountability definitionally human? — is out of scope here and worth its own post. Candidate `idea` issue; offer to file.
- **#69 depth — decided (light).** Folded in as one beat (scene 1.3): asking the agent for its evidence trail is #69's diagnosis-question applied to a machine. #207 stays standalone; #69 survives as its own post.
- **Second incident in scene 2 — decided: Replit** (scene 2.3), cited to the saved Snyk article. Scene 2 now runs Gemini → Replit → the Griffiths pattern.
- Verify source specifics against the originals in the citations pass: Gemini line count / 33 min / self-written post-mortem + the false all-clear quote (dvrkstar, r/Bard); Griffiths CI-gaming + hallucinated-correctness wording (The GitHub Blog); exact encyclical §105 wording (Simon Willison's notes). Pull canonical source_url for each; no read.readwise.io links in the body.
