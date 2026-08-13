---
name: post-draft
description: Draft a narrative blog post from an approved outline — body, voice, citations, frontmatter. The main step after outline-draft; requires an approved outlines/<slug>.md. Invoke via /post-draft <slug>.
---

# Post draft

Consumes an approved outline (`outlines/<slug>.md`, the artefact
`outline-draft` produces) and turns it into the publishable post.
Requires an approved outline; run `outline-draft` first if there isn't
one.

The outline is the source of truth. If the prose needs a structural
change, change the outline first (via `outline-draft`), then bring the
post back in line.

Pipeline: **body → conventions → syndication check.** The body is the
story-specific craft this skill owns; the conventions are shared and
applied from their single homes.

## 1. Body — write the scenes

Render the outline's beats as story, scene by scene. The outline is the
skeleton: **a beat expands into a passage.** Each beat becomes
lived prose — a moment to stand in, fact braided with feeling,
transitions that carry the reader from one beat to the next. The post
reads as *more* than its outline; *confirmed when* every paragraph
carries something the outline can't (a scene, the braid, a transition),
not just its beat reworded. If a paragraph reads straight off the
outline, it isn't written yet.

Draft the body before locking title or description — both derive from
what the post argues, so the finished body settles them.

A story is **lived in scenes** and **built to one moment of change**;
the reader feels the change by contrast with where it began.

**The test:** for any passage, is the reader *watching something
happen*, or *being told a conclusion*? Watching is story; told is
report. Turn the told passages into scenes, or cut them.

Principles, each with the criterion that confirms it:

- **Build to one moment of change.** Every scene aims at it. *Confirmed
  when:* you can state the moment in one sentence, and only one.
- **Open at its opposite.** *Confirmed when:* the first scene and the
  last are recognisably opposite states.
- **Write scenes, not summary.** Concrete moments with documentary
  detail — real dates, names, what happened. *Confirmed when:* the
  passage shows something a reader could picture.
- **Past tense for past action.** *Confirmed when:* present tense
  appears only for what is true now.
- **Braid fact and feeling.** Every beat carries something concrete and
  something felt. *Confirmed when:* no scene is a fact-dump and none is
  sentiment with nothing to anchor it.
- **Plain diction.** *Confirmed when:* the prose names things the way
  you would aloud; craft vocabulary ("pull", "weight", "braid") stays in
  the workshop.
- **Causal narrative.** Show the mechanism — "Without X, Y happens."
  *Confirmed when:* a reader learns *how* one thing led to another.
- **Observe.** Ownership ("I did X") carries the looking-back.
  *Confirmed when:* it reads as an account of what happened.
- **Land on substance.** *Confirmed when:* the last line says something
  the post hasn't said yet.
- **Tense — a story may glance forward, sparingly.** "Document only what
  exists at HEAD" is a docs rule, not a narrative one; a story can use the
  future tense for a grounded, stated direction. *Confirmed when:* any
  forward glance is a real plan you're on, used once or twice at most.

Draft and lock **one scene at a time, with the author.** Source each
scene's concrete moment before staging it — provable facts where they
exist, and ask the author for the lived specifics rather than inventing
them ([[feedback_post_claims_provable]]). Stage the scene, refine the
wording together, lock it, move to the next. Flow and direction shift as
the prose takes form; watch the back half, where unattended stretches
drift toward generic prose.

## 2. Conventions

Voice, citations, and frontmatter are shared across every article type.
Apply them from their single homes:

- **Voice** → `.claude/voice.md`. Sentence-level rules and the
  poetic-without-poetry register; apply across the drafted body, then run
  its revision pass. The descriptive fingerprint in the same file
  calibrates against what the corpus measurably does.
- **Citations** → `.claude/citations.md`. Ground claims in the author's
  actual reading; cite the public source URL a reader can open.
- **Frontmatter and scheduling** → `docs/reference/post-frontmatter.md`.
  Fields, the Tuesday (tech) / Sunday (reflective) cadence, timezone, the
  publication gate, tags, archival stanza.

Story-specific: choose the title once the prose exists and the body has
settled what it argues (anniversary / revision / substrate-shift /
freeform); derive the description from the finished body. Draft both from
the completed post.

## 3. Instagram syndication check

dlvr.it auto-syndicates each post to the text and link surfaces from the
RSS feed (`docs/adr/0001-use-dlvrit-for-social-syndication.md`) — no
action needed. Instagram is the hand-crafted exception. Once the post is
settled, judge image-fit: does it carry genuine visual material (book
covers, screenshots, diagrams, a visual-native topic like a game or book
review), or is it text-heavy engineering prose?

If image-prone, flag it — tell the author this is a blog post *and* a
strong Instagram post, and to run `/syndicate-instagram <slug>` once it's
live (the Instagram post links back, so it needs the published canonical
URL). If text-heavy, stay quiet; most engineering posts skip Instagram.

## When to invoke

- `/post-draft <slug>` once `outline-draft` has produced an approved
  outline.
- Revising an in-progress draft (voice pass + frontmatter).
- Adding citation backing to an existing draft.

## Output

Iterate in `src/data/blog/<slug>.md`. Commit incrementally — each
substantive change as its own commit with the reasoning in the body.

Final state before promoting the PR out of draft:

- Title, description, slug match the body.
- `pubDatetime` set to a future Tuesday or Sunday at 08:00 local.
- Vale + markdownlint pass via `pre-commit run --files <path>`.
- `pnpm build` clean.
- Body links point at public source URLs.

Provenance: Matthew Dicks, *Storyworthy* (moment of change, start at its
opposite); Jack Hart, *Storycraft* (scene, arc, story-versus-report);
Lorin Hochstein, "The Power of Stories" (SREcon Americas 2026, the
fact/feeling braid).
