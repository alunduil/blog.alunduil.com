---
name: outline-draft
description: Draft the outline for a narrative blog post — gather substance, build a scene-and-beat outline, diagnose it, and stop at an author-approved outline. The pre-step to post-draft; story posts only. Invoke via /outline-draft [#N] for an idea issue, or omit for freeform.
---

# Outline draft

The pre-step of the writing pipeline. It produces one artefact — an
approved `outlines/<slug>.md` — and stops there. `post-draft` consumes
that outline and refuses to start without it.

Stories only. Technical posts outline by their subject, not by scene.

Pipeline: **substance → outline → diagnose → approval.**

## Why this is its own step

The outline-approval gate is the most important control point in the
pipeline: it catches a wrong angle, a missing scene, or a misjudged arc
while the fix still costs a line, not 2,000 words. So this skill ends at
an approved outline and hands off — it never drafts prose.

## 1. Substance

Don't draft from inference. Ask 3–5 anchor questions that ground the
post in lived experience.

For methodology / practice posts:

- What's still true vs. what's changed since the original claim?
- What was the actual trajectory (arc, peak, current state)?
- What was the forcing function for any tool/practice shift?
- What aged better or worse than expected?

For tooling / decision posts:

- Current stack vs. previous stack — specific swaps.
- Deciding factor for each swap (integration, feature, forcing
  function).
- What carried forward unchanged.

Picking up an idea issue (`gh issue view #N`): use `## Spark` + `## Why
it could be interesting` as the kernel; open questions become discovery
anchors.

The moment of change and the feeling around it are claims too, not just
the dates. State the inferred climax and any inferred motivation back to
the author as assumptions to confirm or kill *before* building the arc on
them — a wrong peak or a wrong emotional thread costs scenes to unwind,
where a wrong fact costs a parenthetical.

Substance lands as the outline file's **header**: the logline (the one
moment of change), where the story opens (its opposite), and the open
questions / anchors still to confirm. That header is phase 1's output
and the top of phase 2's artefact — no separate brief file.

## 2. Outline — scene → beat

A story is a sequence of **scenes** (concrete moments); each scene is a
sequence of **beats**. A **beat is one unit of change, on one line.** If
a line needs comma-spliced clauses to hold together, it is two beats.

Beats are the skeleton, deliberately terse: capture the change, not the
prose. `post-draft` renders them into story — scenes, the braid, flow.
Keep the outline a skeleton so that craft has somewhere to go.

The outline's whole job: read the beats top to bottom and feel the story
move. A stall, leap, or doubling-back shows here — fixable for the price
of a line.

Criteria:

- **One change per beat, one line.** Short enough to scan the sequence
  at a glance.
- **Anchors as parentheticals.** Dates, PR and issue numbers, provable
  facts ride in `*(...)*` on the beat they support.
- **Scenes are moments, not topics.** Name a scene for the moment it
  drops the reader into; a section-label name ("What changed") has
  drifted toward an essay.
- **Arc in the scene order.** First scene furthest from the change, last
  arrives at it. Give each scene a one-line *role* — the opposite, the
  lift, the turn, the landing — so the arc reads in the headings alone.
- **Each scene earns its place.** One scene, one job.

Build to the one moment of change; start at its opposite. Lived beats
are the author's to supply — anchor the provable, ask for the rest. The
corpus lands on an admitted gap, not a triumph (`.claude/voice.md`) —
the last scene's role is usually the honest limitation, not the win.

## 3. Diagnose

Before approval, read the beats top to bottom and check the nine
failure signatures:

1. **Overloaded scene** — one scene carrying two changes → split.
2. **Redundant beats** — two beats saying the same thing → merge.
3. **Stall** — several beats on one micro-moment that don't advance.
4. **Leap** — adjacent beats with an unstated step the reader can't
   bridge.
5. **Flat arc** — the first scene isn't the opposite of the last, so
   there's no contrast to feel.
6. **Unanchored claim** — a factual beat with no parenthetical and not
   marked TBD. Includes false precision: a beat asserting a count or
   certainty ("the one story") the subject doesn't bear → state the real
   range ("zero or more").
7. **Topic-naming** — a scene named like a section → drifting to essay.
8. **Amorphous phrase** — a beat that gestures abstractly ("the thing,"
   "points outward," "opposite purpose," "push the work out," "places to
   hide") instead of naming something concrete → ground it: say *which*
   machine, *what* output, *what* it actually does.
9. **Double climax** — the arc builds to two different moments of change,
   so the peak is split and the title points at only one. Demote one to
   setup or to the landing. Test (mirrors `post-draft`): state the single
   moment in one sentence, and only one.

The title in the header is a **working title** — a handle for the file
and the angle, not a commitment. The real title is chosen in `post-draft`
once the prose exists and the body settles what it argues; don't burn
approval cycles refining it here.

## Shape

```markdown
# <Working title> — outline

<Logline: the one moment of change, where the story opens (its
opposite), the surrounding years as context, open questions to confirm.>

## 1. <Scene name> — *the opposite*

1. <beat> *(anchor)*
2. <beat>

## 2. <Scene name> — *the lift*
...

## Open

- <unresolved thread: a citation to find, a fact to confirm>
```

## When to invoke

- `/outline-draft #N` — build the outline for an idea issue's story.
- `/outline-draft` — freeform story, no issue.

## Output

Iterate in `outlines/<slug>.md` (tracked; outside `src/`, so unpublished
and excluded from the prose linters and lychee). Run the Diagnose pass.
Confirm with the author. The skill ends at approval — hand to
`post-draft`.

The outline drives the post, one direction only: after approval,
structural changes originate here and flow forward to the post. Never
back-port post edits into the outline — the outline is the source of
truth.

Provenance: Jack Hart, *Storycraft* (arc, scene); Matthew Dicks,
*Storyworthy* (the one moment of change); Lorin Hochstein, "The Power of
Stories" (SREcon Americas 2026).
