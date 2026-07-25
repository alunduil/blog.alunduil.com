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
evidence, not a moment of change.

A review is a **short article** — argued and evidenced, but small. That makes
it distinct from a **note**: it syndicates today as a title-and-link teaser via
dlvr.it, and an argued review is too long for full-body syndication on the
character-limited networks (Bluesky, Threads) regardless. A note-length
*micro-review* — an aphoristic verdict in a sentence or two — is a different
artefact and belongs to `note-draft` (#323) and the note pipeline (#321/#322),
not here.

Voice, citations, frontmatter, and the Instagram check are shared. Apply
them from their single homes — voice (`.claude/voice.md`), citations
(`.claude/citations.md`), frontmatter and scheduling
(`docs/reference/post-frontmatter.md`); only the review-specific deltas
live here.

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
  **Ask for the author's own snapshots and video captures**, every game, at the
  same time as the take questions. A moment they chose to record is already the
  concrete moment the argument needs, and reviews carry the work's art rather
  than the dynamic OG card, so captures serve as evidence and image both.
  Nothing else surfaces them — Media Log holds status only and Readwise holds
  no game highlights. "None exist" is a real answer that settles the question.
  **Keep length as a pacing claim rather than a number** — say the middle
  drags, or that it ends before it wears out. Hours-to-credits is storefront
  metadata that varies by player and evidences nothing, so it earns no space
  in an argument. Media Log's `Main Story (hrs)` informs the read; it doesn't
  reach the prose.

Picking up an idea issue (`/review-draft #N`): `## Spark` is the kernel, the
open questions are the discovery anchors, and the object type comes from the
issue. Infer the object type when obvious; ask when not.

**Get the work right — the take is the author's, the facts are the work's.**
The reviewer supplies the opinion; the work supplies the plot, the characters,
and what each pole *actually is*, and those must be accurate. Don't build a
pole from a single beat (one line about survival is not the whole Mafia), and
don't infer a character's position or inner life from the argument you want
(a son of the family is not neutral). Before the spine, ground the work in
real sources — the author's read plus a plot summary or reference — and check
each pole and each named character against them. This is the most expensive
error to get wrong: a mischaracterised pole collapses the whole spine, not a
line, and costs a full re-draft.

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

The `outlines/` dir is unpublished to the site but **public in the repo**. Open
a spine that names plot beats with a one-line `> **Spoilers.** …` marker; keep
the beats concrete regardless — the spine needs them to drive the draft, and a
reader in the notes drawer is opt-in. The spoiler *fence* is the published
post's job (§4), not the outline's.

This is the cheap control point, the review's equivalent of the outline gate: a
wrong thesis costs a line to fix here, two thousand words after drafting.
Confirm the thesis and the points with the author before drafting prose. The
spine drives the post one direction only — after approval, structural changes
originate here and flow forward, never back-ported from the draft
([[feedback_outline_drives_post]]).

## 4. Draft — argument, not summary

Render the spine into `src/data/blog/reviews/<slug>.md`, one point at a time with the
author. Review-specific rules, on top of the blog voice (`.claude/voice.md`):

- **Argument outweighs summary, roughly four to one.** Every evaluative claim
  carries a specific moment from the work as its evidence. A paragraph that
  recounts without judging is summary — cut it or turn it into evidence for a
  claim.
- **The object stays load-bearing.** The reviewer's own ideas enter as the
  *lens* on the work, not a creed the work is a springboard for. If the draft
  would survive deleting the object, it has drifted into a personal essay — a
  different post, not this review. Keep the philosophy at the mechanics of the
  work, never a stance broadcast.
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
- **Don't manufacture stakes.** Motivation and feeling are claims like any
  other ([[feedback_post_claims_provable]]). Don't invent why the author read
  it, that it haunted them, or a dramatic inner bind — the honest provenance is
  usually mundane (the digest surfaced a finished book) and the real take is
  often plain ("I come down pragmatic"); state it understated, never inflated
  into agonising the author wouldn't write. Same for the work's characters:
  render only inner states the text supports, never invented ones ("never looks
  at home there").
- **A light frame is enough.** A plain stance in a thin first-person frame ("I
  read it… I came down…") is a real review, often stronger than a heavyweight
  personal thesis. If a personal paragraph reads thin, cut it and let the
  analysis carry — the take survives in the frame and the argument. Don't force
  depth the take doesn't have.
- **Spoilers — trade on ideas and texture, never the turns.** A review spoils
  by revealing what *happens*; it stays clean revealing what the work is *about*
  and how it feels. Build the recommendation from spoiler-free currency: the
  unresolved question, the texture, the reading experience. Recast plot beats as
  *dispositions* (who a character is), not events — show the early/establishing
  one concretely, gesture the outcome-adjacent one. Fence once, early and
  honestly. Sell the surprise as a question the reader gets to sit in. The test:
  could a reader who then picks up the work still be surprised by the plot? If a
  sentence's pull needs a known outcome, cut it or lift it to theme. The
  **frontmatter description** is the strictest surface — a pre-read teaser,
  tighter than the body — so give away nothing there. Two quiet leaks recur:
  "the book leaves it unresolved" is itself an ending-reveal (pitch it at the
  work's *stance*, poses-and-steps-back, not the plot's end), and fate words
  like "outlasts" or "never chooses" reveal outcomes. Softened, those can stay
  in the body as thematic analysis; the description can't carry them.
- Otherwise the blog voice holds: first person, hedged, headerless reflective
  register, CMOS grammar, very low formatting — prose carries the structure
  (`.claude/voice.md`).

## 5. Frontmatter, citations, syndication

The shared conventions apply unchanged — citations (`.claude/citations.md`),
frontmatter and scheduling (`docs/reference/post-frontmatter.md`), and the
Instagram check — with review-specific notes:

- **Location and cover:** reviews live in `src/data/blog/reviews/<slug>.md`,
  which serves at `/posts/reviews/<slug>/` (the theme keeps non-`_` folders in
  the URL). Each review carries the work's cover as its OG image, the one post
  type that does — download it (Open Library `covers.openlibrary.org/b/id/…`,
  or the author's own scan) to `src/assets/images/<slug>-cover.jpg` and set
  `ogImage: ../../../assets/images/<slug>-cover.jpg` (three `../` from the
  deeper `reviews/` folder). It replaces the dynamic OG card.
- **Cadence:** reviews are reflective — **Sunday** 08:00 local for `pubDatetime`
  (`docs/reference/post-frontmatter.md`).
- **Tags are the work's subject, not the format.** Tag what the review is
  *about* — the mafia, myth-making, whatever the argument engages — never
  `review` or `book`; those are format/era labels the taxonomy forbids
  (`docs/reference/post-frontmatter.md`).
- **Instagram:** reviews are strongly image-prone (covers, screenshots, box
  art). dlvr.it covers the auto surfaces on publish
  (`docs/adr/0001-use-dlvrit-for-social-syndication.md`); flag
  `/syndicate-instagram <slug>` once live.
- **Never** `draft: true`; a future `pubDatetime` gates publication
  (`docs/reference/post-frontmatter.md`).

## When to invoke

- `/review-draft #N` — an idea issue for a book/paper/game review.
- `/review-draft <title|path>` — freeform, no issue.
- Revising an in-progress review draft (voice + argument-vs-summary pass).

## Output

Iterate in `outlines/<slug>.md` then `src/data/blog/reviews/<slug>.md`. Commit
incrementally. Final state before promoting the PR: title/description/slug match
the body, `pubDatetime` a future Sunday 08:00 local, Vale + markdownlint pass
via `pre-commit run --files <path>`, `pnpm build` clean, no private Reader URLs.

Provenance: the UNC Writing Center handout (review is commentary not summary;
~80/20 evaluation to summary; thematic organisation); Parul Sehgal, *NYT* ("a
review is someone performing thinking"); Kat Clay ("a review answers a single
question — why should you read this book"; draw from your own expertise).
