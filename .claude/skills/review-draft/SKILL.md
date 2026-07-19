---
name: review-draft
description: Draft a review post — book, paper, or video game — starting from the one question a review answers: recommend it or not, and why. Gates on whether there's a real argument (kills the "it was fine" non-review), lands the thesis, then builds argument-not-summary prose in the blog voice. Invoke via /review-draft [#N | title | path].
---

# Review draft

A review is an **argument, not a summary**. It answers one question — why
should someone read, read, or play this, or not — and every claim it makes
rides on a specific moment from the work. A recounting of the plot or the
contents is a book report; the review is the take on top of it.

Reviews are a **style of article**, not a scene-built story. This skill is a
sibling of the story pipeline (`outline-draft` → `post-draft`), not a caller of
it: the scene→beat arc doesn't apply, and the spine is a claim with its
evidence, not a moment of change. Voice, citations, frontmatter, and Instagram
syndication are shared — apply `post-draft` §2–5 and `.claude/voice.md` for
those; only the review-specific deltas live here.

Pipeline: **gate → substance → spine (approval) → draft → frontmatter.**

## 1. Gate — is there a review here?

Start at the top, before gathering anything else: **would you recommend it, and
why?** One sentence each way is enough to tell.

The go/no-go: a review needs a **claim** — something you'd argue that isn't a
recap of the plot or the contents. "It was fine, nothing to see here" is a
no-go. Neutral indifference makes a report, not a review; kill it here rather
than draft two thousand words of shrug. A no-go isn't a failure — it's the
skill doing its job. Surface it and stop; the idea issue can close as
not-planned or wait for a real angle to surface on a re-read or replay.

Recommend *or* pan both pass. A sharp "skip this, because…" is a review; the
disqualifier is the absence of an argument, not its polarity. Lukewarm-with-a-
reason ("worth it only if you already love the genre") passes too — that
conditional *is* the claim.

## 2. Substance — four questions, adapted to the object

Ask these top to bottom; the answers become the spine. Don't infer them — the
take is the author's ([[feedback_post_claims_provable]]). Vocabulary shifts by
object type, the shape doesn't:

1. **The single question — the thesis.** Finish "Read / read / play this
   because ___" (or "Skip it because ___"). That sentence is the logline.
2. **The measurement — against what?** The argument engine is comparison: the
   canon, prior work, or genre the author already holds in their head and can
   measure this against. This is the move a generic review can't make.
3. **The evidence — one concrete moment.** The single scene, passage, result,
   mechanic, or system that made the thesis *felt*. This is the ~20% summary,
   and it exists to do argument-work, not to recount.
4. **The honest tail — the admitted gap.** What the work left unresolved, or
   where the author's read might be wrong. The corpus's honest-limitation close
   ([[feedback_no_blame_in_retrospect]], `.claude/voice.md`).

Per object type:

- **Book** — evidence is a scene, character, or line; measure against comparable
  authors or a canon; the tail is what it made you keep chewing on.
- **Paper** — the thesis is the contribution ("read this because the result is
  X"); measure against prior work and the field; evidence is a result, method,
  or figure; the axis is validity and scope, not enjoyment, and the tail is what
  it *doesn't* establish.
- **Video game** — evidence is a moment, mechanic, or system; measure against
  genre and comparable games; the tail is where the systems fall short. Systems
  and feedback loops are the author's native lens ([[user_self_sustaining_systems]]).

Picking up an idea issue (`/review-draft #N`): `## Spark` is the kernel, the
open questions are the discovery anchors, and the object type comes from the
issue. Infer the object type when obvious; ask when not.

## 3. Spine — the approval gate

Write the review spine to `outlines/<slug>.md` (tracked, outside `src/`, so
unpublished and excluded from the prose linters and lychee):

```markdown
# <Working title> — review spine

**Thesis:** <the one firm claim — recommend/pan/conditional, stated flat.>

## Supporting points (thematic, not chronological)
1. <claim> — evidence: <the concrete moment>
2. <claim> — evidence: <...>

## Honest tail
<what it left unresolved / where the read might be wrong>
```

This is the cheap control point, the review's equivalent of the outline gate: a
wrong thesis costs a line to fix here, two thousand words after drafting.
Confirm the thesis and the points with the author before drafting prose. The
spine drives the post one direction only — after approval, structural changes
originate here and flow forward, never back-ported from the draft
([[feedback_outline_drives_post]]).

## 4. Draft — argument, not summary

Render the spine into `src/data/blog/<slug>.md`, one point at a time with the
author. Review-specific rules, on top of `post-draft` §2 voice:

- **Argument outweighs summary, roughly four to one.** Every evaluative claim
  carries a specific moment from the work as its evidence. A paragraph that
  recounts without judging is summary — cut it or turn it into evidence for a
  claim.
- **Thematic order, never the work's chronology.** Organise by the spine's
  points. Walking the reader through the plot or the table of contents in order
  is the surest tell that the draft has slid back into report.
- **Open on the argument.** Latch the opener on a concrete moment that *delivers
  the thesis* — same latch-first rule as a story, but here the hook carries the
  claim, not just the mood.
- **Firm claim, honest tail.** State the recommendation without hedging — the
  verdict is not the place to be wishy-washy. The *close* still lands on the
  admitted gap, not a triumph. This is how a clear recommendation and the
  corpus's honest-limitation signature coexist: confident spine, honest ending.
- **Spoiler-conscious.** Keep the summary minimal and mark what would spoil.
- Otherwise the blog voice holds: first person, hedged, headerless reflective
  register, CMOS grammar, very low formatting — prose carries the structure
  (`post-draft` §2, `.claude/voice.md`).

## 5. Frontmatter, citations, syndication

`post-draft` §3–5 apply unchanged, with review-specific notes:

- **Cadence:** reviews are reflective — **Sunday** 08:00 local for `pubDatetime`
  ([[project_publication_time_convention]]).
- **Tags are the work's subject, not the format.** Tag what the review is
  *about* — the mafia, myth-making, whatever the argument engages — never
  `review` or `book`; those are format/era labels the taxonomy forbids
  ([[feedback_tags_are_content_only]]).
- **Instagram:** reviews are strongly image-prone (covers, screenshots, box
  art). Flag `/syndicate-instagram <slug>` once live (`post-draft` §5).
- **Never** `draft: true`; a future `pubDatetime` gates publication
  ([[feedback_drafts_via_date_not_flag]]).

## When to invoke

- `/review-draft #N` — an idea issue for a book/paper/game review.
- `/review-draft <title|path>` — freeform, no issue.
- Revising an in-progress review draft (voice + argument-vs-summary pass).

## Output

Iterate in `outlines/<slug>.md` then `src/data/blog/<slug>.md`. Commit
incrementally. Final state before promoting the PR: title/description/slug match
the body, `pubDatetime` a future Sunday 08:00 local, Vale + markdownlint pass
via `pre-commit run --files <path>`, `pnpm build` clean, no private Reader URLs.

Provenance: the UNC Writing Center handout (review is commentary not summary;
~80/20 evaluation to summary; thematic organisation); Parul Sehgal, *NYT* ("a
review is someone performing thinking"); Kat Clay ("a review answers a single
question — why should you read this book"; draw from your own expertise).
