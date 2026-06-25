---
name: post-draft
description: Draft a narrative blog post from an approved outline — body, voice, citations, frontmatter. The main step after outline-draft; requires an approved outlines/<slug>.md. Invoke via /post-draft <slug>.
---

# Post draft

Consumes an approved outline (`outlines/<slug>.md`, the artefact
`outline-draft` produces) and turns it into the publishable post.
Refuses to start without an approved outline — if there isn't one, run
`outline-draft` first.

The outline is the source of truth and is never edited from here. If the
prose needs a structural change, change the outline first (via
`outline-draft`), then bring the post back in line.

Pipeline: **body → voice → citations → frontmatter.** Each stage has
different ownership; don't conflate them.

## 1. Body — write the scenes

Turn the outline's beats into prose, scene by scene. Draft the body
before locking title or description — both derive from what the post
argues, and front-loading them locks in framing the body may not honour.

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
- **Observe, don't apologise.** Ownership ("I did X") without regret ("I
  should have"). *Confirmed when:* the looking-back reads as account,
  not confession.
- **Land on substance.** *Confirmed when:* the last line says something
  rather than restating the post or drumrolling toward it.

Draft **paragraph by paragraph**, reviewing each before the next — flow
and direction shift as the prose takes form. Watch the back half:
unattended, long stretches drift toward generic prose.

## 2. Voice

Sentence-level conventions, applied across the drafted body. Cross-
reference memory:

- [[feedback_no_blame_in_retrospect]] — ownership OK; regret goes.
- [[feedback_causal_narrative_over_contrast]] — "Without X, Y happens"
  beats "X required Z; Y doesn't".
- [[feedback_tags_are_content_only]] — tags are content topics.
- [[project_grammar_lean]] — CMOS for structure, en_GB for spelling and
  quote-punctuation.
- [[project_possessive_convention]] — singular *s*-ending nouns take
  *'s* (Books's, Charles's).

Pass:

- Drop summary-as-flourish ("outlasted them all", "Everything between me
  and the books").
- Ease in via personal continuity ("I'm still…", "Since college I've
  always…") rather than fragment-label openers.
- Don't repeat temporal anchors; book-end them.
- Em-dashes only for information asides, not drama.
- Strip blame: no "I should have", no confession closers.
- CMOS-style possessives; add new variants to
  `.vale/styles/config/vocabularies/Custom/accept.txt` as
  Custom.Spelling surfaces them.

Iterate in the file; apply principles confidently, surface only genuine
judgement calls.

## 3. Citations

Ground claims in the author's actual reading where applicable:

- `mcp__claude_ai_Readwise__readwise_search_highlights` — vector-search
  the claim's topic.
- `mcp__claude_ai_Readwise__reader_search_documents` — filter
  `location_in=["archive"]`, vector-search.

Get **original source URLs** from
`mcp__claude_ai_Readwise__reader_list_documents` with
`response_fields=["url", "source_url", "title", "source"]`. Never use the
private `https://read.readwise.io/...` URLs — readers can't reach them.

For long URLs, use reference-style links to stay within the 80-char
source wrap. If the archive lacks canonical citations, surface what's
actually there honestly; don't fabricate citations to works the author
hasn't engaged with.

## 4. Frontmatter

Apply codified conventions:

- `pubDatetime`: 08:00 in the author's period-appropriate IANA timezone.
  **Tuesday** for tech / methodology, **Sunday** for casual /
  reflective. Skip Monday and Friday unless there's a reason. See
  [[project_publication_time_convention]].
- `timezone`: per-post override when the authoring zone differs from
  `SITE.timezone`.
- `description`: derived from the final body, ~120–150 chars. No stale
  references to cut sections.
- `tags`: 2–3 content topics, soft cap ~3. No categorical labels
  (archive / era / format).
- `title`: anniversary / revision / substrate-shift / freeform — pick
  what the body argues.
- **Never** set `draft: true`. Publication is gated by a future
  `pubDatetime` and `SITE.scheduledPostMargin`; merging the PR accepts
  the work. See [[feedback_drafts_via_date_not_flag]].
- `hideEditPost: true` for archival republishes or immutable content.
- Archival republishes live under `src/data/blog/_<engine>/` and open
  with the stock stanza ([[project_archive_stanza]]).

**Don't pin** `pubDatetime` / `modDatetime` to local-branch commits —
both are live-site moments ([[feedback_post_datetime_semantics]]). Use a
future `pubDatetime` as both gate and placeholder; pick the *nearest*
cadence-appropriate day, since `SITE.scheduledPostMargin` is ~15 minutes
and the date is the real publish target.

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
- No links in body point at private Reader URLs.

Provenance: Matthew Dicks, *Storyworthy* (moment of change, start at its
opposite); Jack Hart, *Storycraft* (scene, arc, story-versus-report);
Lorin Hochstein, "The Power of Stories" (SREcon Americas 2026, the
fact/feeling braid).
