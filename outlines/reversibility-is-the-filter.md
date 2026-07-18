# Reversibility Is the Filter — outline

**Logline (the one moment of change):** Reading Ian Duncan's convex/concave
essay in late May 2026, I recognized that the reversibility guardrail I'd
written weeks earlier to keep a coding agent from doing what I couldn't undo is
the same reversal-cost test I'd been applying to teams at work for years — the
discipline was everywhere in my repos and the name for it was in none of them.

**Opens at its opposite:** the guardrail as a narrow, defensive leash — one
rule to keep the agent's blast radius small, not a philosophy of decisions.

**Context window:** guardrail late April, the reversibility wave through May,
the name arriving 2026-05-24, the practice continuing into June–July. All
anecdotes git-provable in alunduil-chezmoi, genshin.dungeon.studio, and this
blog repo, and placed on the correct side of the 05-24 recognition (verified
2026-07-18 against commit dates and Readwise highlight timestamps).

**Register:** narrative (continuous, no section headers, built to one moment,
opens at the opposite, closes on an admitted gap). Governing image: the *door*
you can or can't walk back through, worked lightly (chosen over Duncan's
convex/concave and the repos' plain "hard to reverse" — the concrete, non-jargon
one). Second person only if it earns a pull-in.

**Assumptions confirmed with author (2026-07-18):** actor+owner mostly collapse
into me + future-me on a solo project; the real cost of a bad decision is the
*energy to recover*, not being blocked; personal projects are a proving ground
for decisions reused at work (Rands: decisions are the output of software
engineering); I haven't taught the agent convex/concave language yet.

## 1. The leash — *the opposite*

1. I wrote one rule into the agent's config: reversible local work proceeds, pause before anything I can't undo *(alunduil-chezmoi `40b8872`, 2026-04-30; "force-pushing, modifying remote history, deleting branches, deployments, dropping data")*
2. It wasn't decision theory — it was a leash, keeping the agent's blast radius small.
3. I wasn't naming a principle; I was stopping one specific way of getting hurt.

## 2. The same instinct, unnamed — *the lift*

1. The test kept surfacing where the agent wasn't the actor at all.
2. Whether a decision even earned an ADR came down to one question: is it hard to reverse? *(alunduil-chezmoi ADR skill `8408805`, 2026-05-10 — "architecturally significant and hard to reverse" vs "easily reversed... a commit message carries it better")*
3. I kept a tool in bash rather than rewrite it, on reversibility alone, deferring the one-way door until a trigger justified it *(chezmoi ADR 0001 `a46323e`, 2026-05-10 — "Picking the irreversible direction earlier than necessary forfeits optionality")*
4. Same test everywhere, called nothing. *(all of this predates 05-24; ADR 0002's actual walk-through-the-door lands in scene 5 as a post-recognition beat)*

## 3. One line, drawn twice — *widening*

1. The line wasn't only for me or only for the agent — I drew the same one around each.
2. I shadowed `gh` so the agent couldn't open a ready pull request — one command away from an outward-facing action, gated; everything reversible left free *(chezmoi `0910097`/`aff4f16`, 2026-04-24 — draft-guard so an agent "can't accidentally open a ready-for-review PR")*
3. I drew the same line around my own workflow: gate the deploy, let pull requests build freely *(blog `c4f3f25`, 2026-05-10 — PRs build, don't deploy)*
4. What taught me the gate's placement: a dependency bump that merged green and only broke after merge, on the deploy *(blog #137→#151)* — the cost wasn't being blocked, it was the energy to climb back.

## 4. The proving ground — *the stakes*

1. This looks like hobby fussing until you see what it's rehearsal for.
2. A solo side project runs production-grade discipline: schema changes can't silently narrow stored data, published URIs are frozen, every version only widens *(genshin `8579755` 2026-07-02; DSGEP-003 immutable versioned URIs)*
3. That's the same API-versioning judgment I spend at work, practiced where a wrong call costs me a weekend instead of a team a quarter.
4. Cheap reversible reps here buy cheaper reads of the expensive one-way doors there.

## 5. The name — *the turn (climax)*

1. In late May I read Duncan: convex vs concave, the reversal-cost test, "can the people who live with this decision see the shape of it." *(Readwise highlights, 2026-05-24)*
2. I'd run this test on teams at work for years and never had a word for it — and the word wasn't in my repos either, before or since; the vocabulary appears in not one of them.
3. The click: the leash I'd written weeks earlier to keep an agent from doing what I couldn't undo is that same years-old team test. One filter, three actors — me, the agent, the team.
4. The fourth question mostly dissolves when I'm my own owner — until the decision leaves my head, to a user's saved collection or my partner's home automation, and it snaps back *(genshin `8ef066e`, 2026-07-03 — a shape change would silently drop a user's saved collection; partner/home-automation author-confirmed)*
5. And owning it was never owning the task — it was owning the goal, which is the same thing as owning the reversal cost when the door turns out to be one-way *(Stay SaaSy, "the core unit of ownership is a goal" — issue source #3; evaluate whether this earns its place)*
6. Having the word didn't end the practice — it sharpened it: I walked ADR 0001's deferred rewrite through the door once its triggers fired, and drew the line around a review agent so it could advise but not `push` *(chezmoi ADR 0002 `2d24994`, 2026-06-04; genshin `a8cf4e3`, 2026-06-28 — both after 05-24, now done with the vocabulary for it)*

## 6. The map I didn't draw — *the landing (admitted gap)*

1. The gate only works if I read the shape of the decision right.
2. But the agent that makes me fast is the same tool I lean on to read that shape.
3. So it can hand me a convex-looking map of a concave decision, and I commit anyway — the model was wrong and I couldn't see it, or the decision was gnarlier than any model showed.
4. I haven't taught the agent the convex/concave language yet; maybe I should.
5. The test sizes how much I deliberate. It can't verify that I read the door right.

## Open

- **"Decisions are the output of software engineering"** — attributed to Rands in conversation; no verbatim source found. Checked "Seven Decisions" (leaders judged by decision quality/reasoning — nearest), "The Process Myth" (frames *code* as the engineer's output, not decisions), and his "demonstrated sound judgment" talk framing. Resolution for post-draft: attribute loosely and anchor to "Seven Decisions", or cut and let the proving-ground beat stand alone — unless the author names the exact book/talk. *(not a blocker for the outline PR)*
- **Partner / home-automation specific (beat 5.4)** — author-confirmed, config lives in the out-of-scope `~/alunduil-homeassistant` repo. Author ruling: keep it light and author-scoped; add a concrete anecdote only if it brings emotion or interest, otherwise leave it as-is. Not central to the post's core.
- **Stay SaaSy "ownership = a goal" (beat 5.5)** — added for the author to evaluate in place; cut in post-draft if it dilutes the peak rather than deepening it.
- **Title** — working title only; real title chosen in post-draft once the prose settles what it argues.
