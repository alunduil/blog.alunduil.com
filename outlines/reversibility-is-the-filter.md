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
for decisions reused at work; I haven't taught the agent convex/concave
language yet.

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

Keep Duncan the spark, not the subject — compress, don't recap the framework. No years-of-conscious-team-practice claim: without the name it wasn't consciously done. The fourth question is not here; it opens scene 6.

1. In late May, Duncan's essay hands me the word: the decisions too costly to undo are concave, and those are the ones worth the best thinking; the rest you get wrong and fix *(Ian Duncan, "Your Best Thinking Is Wasted on the Wrong Decisions," read 2026-05-24)*
2. That was my rule exactly — the short lead I'd tied for the agent — only he set it down as a principle where I'd written it as a precaution.
3. With a name on it the separate rules fall together: the agent guardrail, the tool I wouldn't rewrite, the deploy I held back, the versioning I do at work — not four habits but one question, *how hard is this to undo*, answered everywhere without my seeing it was one.

## 6. The map I didn't draw — *the landing (admitted gap); flow the 2×2 as prose, never a table*

1. Duncan's fourth question — can the people who live with a decision see its shape the way you do — bends, in a mostly-me-and-a-machine loop, into a stranger one: is the shape I see even real, when I read it through the agent?
2. Before an irreversible call I lean on the agent to show me how hard to undo; the gate only works if that reading is right, and the agent that makes me fast is the tool I read the map with.
3. Two things vary on their own: whether the agent's read is right, and whether I can tell. Three of the four pairings survive — right and I know it; wrong and I catch it; right and I distrust it, paying only wasted time.
4. The fourth bites: the map's wrong and I can't tell — a one-way door drawn as a two-way one, walked through certain I can come back.
5. Naming convex/concave in the agent's config sharpens the map; it won't close that cell, because a sharper wrong map still reads as right — and part of "can't tell" is no one's error, the ground rougher than any honest map could show.
6. So the gap is the whole can't-tell column, with no reliable way out: the test sizes how much I deliberate, but can't flag the one case that matters — when my read of the shape is the thing that's wrong.
