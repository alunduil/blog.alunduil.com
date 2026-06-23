---
name: outline
description: Build the scene-and-beat outline for a narrative post on this blog, before prose. Invoked from draft-post's outline stage. Stories only — technical posts outline by subject, not by scene.
---

# Outline

The structural plan for a narrative post: its scenes, and the beats
inside each. Built before the body so the *flow* is inspectable while
moving things is still cheap.

Stories written here only. Everything else on this blog is technical
writing and outlines by its subject.

## The unit: scene → beat

A story is a sequence of **scenes** — concrete moments. Each scene is a
sequence of **beats**. A **beat is one unit of change, on one line.** If
a line needs comma-spliced clauses to hold together, it is two beats.

The outline's whole job: read the beats top to bottom and feel the story
move. A stall, a leap, or a doubling-back shows here — fixable for the
price of a line, not a paragraph.

## Criteria

- **One change per beat, one line.** A beat names what shifts, short
  enough to scan the whole sequence at a glance.
- **Anchors as parentheticals.** Dates, PR and issue numbers, the
  provable facts ride in `*(...)*` on the beat they support, so each
  claim's evidence is visible against it.
- **Scenes are moments, not topics.** Name a scene for the moment it
  drops the reader into. A name that reads like a section label ("What
  changed") has drifted toward an essay — rename it to the moment.
- **Arc lives in the scene order.** The first scene sits furthest from
  the change; the last arrives at it. Give each scene a one-line *role*
  — the opposite, the lift, the turn, the landing — so the arc reads in
  the headings alone.
- **Each scene earns its place.** One scene, one job: a scene doing two
  (a lift *and* a reopening) wants splitting; two beats saying the same
  thing want merging.

## Shape

```markdown
# <Title> — outline

<Logline: the one moment of change, where the story opens (its
opposite), and what the surrounding years are — context, not subject.>

## 1. <Scene name> — *the opposite*

1. <beat> *(anchor)*
2. <beat>

## 2. <Scene name> — *the lift*
...

## Open

- <unresolved thread: a citation still to find, a fact to confirm>
```

## Procedure

1. Settle the moment of change and its opposite with the author (the
   substance stage feeds this).
2. Lay scenes in arc order, each with its role.
3. Break each scene into beats — one change per line, anchors attached.
4. Read straight down. Fix stalls, leaps, doubled beats, and overloaded
   scenes here.
5. Confirm with the author before the body. Lived beats are theirs to
   supply — anchor the provable, ask for the rest.

Hand off to `narrate` for turning beats into prose.

Provenance: Jack Hart, *Storycraft* (arc, scene); Matthew Dicks,
*Storyworthy* (the one moment of change); Lorin Hochstein, "The Power of
Stories" (SREcon Americas 2026).
