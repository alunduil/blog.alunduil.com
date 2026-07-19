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

Render the outline's beats as story, scene by scene. The outline is the
skeleton, not the script: **a beat is not a sentence.** Each beat becomes
lived prose — a moment to stand in, fact braided with feeling,
transitions that carry the reader from one beat to the next. The post
reads as *more* than its outline; *confirmed when* every paragraph
carries something the outline can't (a scene, the braid, a transition),
not just its beat reworded. If a paragraph reads straight off the
outline, it isn't written yet.

Draft the body before locking title or description — both derive from
what the post argues, and front-loading them locks in framing the body
may not honour.

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
- **Tense — a story may glance forward, sparingly.** "Document only what
  exists at HEAD" is a docs rule, not a narrative one; a story can use the
  future tense for a grounded, stated direction. *Confirmed when:* any
  forward glance is a real plan you're on, used once or twice at most —
  never idle speculation ("someday maybe").

Draft and lock **one scene at a time, with the author.** Source each
scene's concrete moment before staging it — provable facts where they
exist, and ask the author for the lived specifics rather than inventing
them ([[feedback_post_claims_provable]]). Stage the scene, refine the
wording together, lock it, move to the next. Flow and direction shift as
the prose takes form; watch the back half, where unattended stretches
drift toward generic prose.

## 2. Voice

Sentence-level conventions, applied across the drafted body. Stated in
full here so the skill stands alone on the web, where local memory isn't
present; the bracketed names are local-only see-alsos.

These are the *prescriptive* rules. `.claude/voice.md` is the
*descriptive* fingerprint measured from the published corpus (hedging
cadence, formatting density, the honest-limitation closer, the
narrative-vs-methodology registers) — read it alongside this section to
calibrate against what the blog actually does.

- **No blame in retrospect.** Ownership ("I did X") is fine; regret ("I
  should have", confession closers) goes. ([[feedback_no_blame_in_retrospect]])
- **Causal over contrast.** "Without X, Y happens" beats "X required Z; Y
  doesn't" — show the mechanism. ([[feedback_causal_narrative_over_contrast]])
- **Tags are content topics,** not archive / era / format labels.
  ([[feedback_tags_are_content_only]])
- **Grammar leans CMOS, en_GB for spelling and quotes:** Oxford comma,
  unspaced em-dashes, spelled-out numbers, semicolons; en_GB spelling and
  punctuation outside the quotes. ([[project_grammar_lean]])
- **Possessives:** singular *s*-ending nouns take *'s* — Books's,
  Charles's (CMOS, not AP). ([[project_possessive_convention]])
- **One independent clause per sentence.** Split every `, and`, semicolon,
  or comma-splice that hooks two complete thoughts together. Length comes
  from subordinate clauses (`which…`, `while…`, `that…`) and cadence, not
  from chaining independents. Compound predicates on one subject are fine
  ("he shows X and stops there"); this reinforces *flow, don't snap* below
  — flow through subordination, never through a pile-up of independents.

**Register — poetic without being poetry** (Tolkien/Carroll touchstone),
the house voice for story posts:

- **Latch first.** Open each scene on something concrete the reader can
  hold — never on context-free abstraction.
- **Flow, don't snap.** Carry weight in cadence and image, not in clipped
  fragments stacked for drama.
- **Punctuation marks structure, not pauses.** Let the period carry the
  load. A comma only for a grammatical job (clause join, serial list,
  trailing absolute), never a mid-clause interrupter for emphasis.
  Colons, semicolons, and em-dashes earn their place only by doing real
  structural work, not as dressing. A plain serial list (a, b, and c)
  beats polysyndeton (a and b and c).
- **Restrained metaphor.** Dial figures *ever so slightly* — a vivid
  simile usually wants toning down, not up.
- **Watch personification.** It creeps in ("a busy place", "a last sign
  of life") — keep it light.
- Plain, warm words: punch without the snap, music without verse.

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

## 5. Instagram syndication check

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
- No links in body point at private Reader URLs.

Provenance: Matthew Dicks, *Storyworthy* (moment of change, start at its
opposite); Jack Hart, *Storycraft* (scene, arc, story-versus-report);
Lorin Hochstein, "The Power of Stories" (SREcon Americas 2026, the
fact/feeling braid).
