---
name: draft-post
description: Draft a new blog post from an idea kernel (issue) or freeform pitch — substance gathering, body drafting, voice pass, citation search, and frontmatter finalisation. Use via /draft-post [#N] where #N is an idea-labelled issue, or omit for freeform.
---

# Draft post

Pipeline: **substance → outline → body → voice → citations → frontmatter**. Each stage has different ownership; don't conflate them.

## 1. Substance (user input)

Don't draft from inference. Ask 3–5 anchor questions that ground the post in the user's lived experience.

For methodology / practice posts:

- What's still true vs. what's changed since the original claim?
- What was the actual trajectory (arc, peak, current state)?
- What was the forcing function for any tool/practice shift?
- What aged better or worse than expected?

For tooling / decision posts:

- Current stack vs. previous stack — specific swaps.
- Deciding factor for each swap (integration, feature, forcing function).
- What carried forward unchanged.

If picking up an idea issue (`gh issue view #N`), use `## Spark` + `## Why it could be interesting` as the kernel; open questions become discovery anchors.

## 2. Outline

Before drafting, build the outline in `outlines/<post-slug>.md` (tracked; outside `src/`, so unpublished and excluded from the prose linters and lychee). Confirm it with the author before the body.

For narrative / personal posts, invoke the **`outline`** skill — scene-and-beat structure built so the flow is inspectable before prose. Lived beats are the author's to supply; anchor what's provable and ask for the rest ([[feedback_post_claims_provable]]).

For how-to / reference / explainer posts, outline by the reader's task or the logical structure.

## 3. Body (Claude drafts, user iterates)

Draft the body before locking title or description. Both derive from what the post argues — front-loading them locks in framing the body may not honour.

For narrative / personal posts, write the prose with the **`narrate`** skill (scenes built to the moment of change). The build order below is for technical / revisit posts.

Build in this order:

1. **Opener** — set up the claim and gesture at structure. Don't summarise.
2. **Current-state anchor** — paint the present picture as the comparison frame. For revisit posts: a "How X now" section between opener and what's-still-true gives both substantive sections something to comment on rather than describe from scratch.
3. **Substantive sections** — what's-still-true / what's-changed are the conventional shapes for revisit posts. For new-method posts: how-it-works / what-it-replaces / where-it-fails.
4. **Closing reflection** — substantive epistemological observation or honest limit, not a summary restatement.

Avoid:

- Drumroll openers ("Everything between me and the books.")
- Summary-statement closers ("X outlasted Y all")
- Section-label fragments ("Concurrent reading.")

## 4. Voice (Claude, iterative)

Apply codified voice principles. Cross-reference memory:

- `feedback_no_blame_in_retrospect.md` — ownership ("I did X") OK; regret ("I should have", "without doing X", "I made the pitch anyway") goes.
- `feedback_causal_narrative_over_contrast.md` — "Without X, Y happens" beats "X required Z; Y doesn't"; show the mechanism, not just the label.
- `feedback_tags_are_content_only.md` — tags are content topics, not categorical organisation (archive / era / format).
- `project_grammar_lean.md` — CMOS for structure, en_GB for spelling and quote-punctuation.
- `project_possessive_convention.md` — singular nouns ending in *s* take *'s* (Books's, Charles's), not AP apostrophe-only.

Voice pass:

- Drop summary-as-flourish ("outlasted them all", "Everything between me and the books").
- Ease in via personal continuity ("I'm still…", "I've been…", "Since college I've always…") rather than fragment-label openers.
- Don't repeat temporal anchors. Four uses of "Eight years on" is too many; book-end use.
- Em-dashes only for information asides, not drama or effect.
- Strip blame: no "I should have", no "without doing X" implying failure, no confession closers.
- Causal narrative over abstract contrast — "Without X, Y happens" over "X required Z; Y doesn't".
- CMOS-style possessives for singular *s*-ending nouns. Add new variants to `.vale/styles/config/vocabularies/Custom/accept.txt` as Custom.Spelling surfaces them.

Iterate in the file. User reviews in place; apply principles confidently, surface only genuine judgement calls.

## 5. Citations (Claude searches)

Ground claims in the user's actual reading where applicable:

- `mcp__claude_ai_Readwise__readwise_search_highlights` — vector-search the claim's topic.
- `mcp__claude_ai_Readwise__reader_search_documents` — filter `location_in=["archive"]`, vector-search.

Get **original source URLs** from `mcp__claude_ai_Readwise__reader_list_documents` with `response_fields=["url", "source_url", "title", "source"]`. Never use the private `https://read.readwise.io/...` URLs — readers can't access them.

For long URLs, use reference-style markdown links to stay within the 80-char source wrap:

```markdown
the [spacing effect][spacing] describes how distributed sessions

[spacing]: https://example.com/long-url
```

If the archive lacks canonical-research citations, surface what's actually there honestly (pop-science, podcasts, blog posts). Don't fabricate citations to works the user hasn't engaged with.

## 6. Frontmatter (Claude proposes, user confirms)

Apply codified conventions:

- `pubDatetime`: 08:00 in the author's period-appropriate IANA timezone. **Tuesday** for tech / methodology, **Sunday** for casual / reflective. Skip Monday (inbox-recovery, attention scarce) and Friday (engagement falls off ahead of weekend) unless there's a specific reason. See `project_publication_time_convention.md`.
- `timezone`: per-post override when the post's authoring zone differs from `SITE.timezone`.
- `description`: derived from the final body shape, ~120–150 chars. Avoid stale references to sections that got cut during voicing.
- `tags`: 2–3 content topics, soft cap ~3. No categorical labels (archive / era / format) — those belong in directory structure or schema fields.
- `title`: anniversary frame ("Eight Years On"), revision frame ("Revisited"), substrate-shift frame ("After X"), or freeform — pick what the body actually argues.
- **Never** set `draft: true`. Publication is gated by a future `pubDatetime` and AstroPaper's `SITE.scheduledPostMargin`; merging the PR accepts the editorial work. See `feedback_drafts_via_date_not_flag.md`.
- `hideEditPost: true` for archival republishes or verbatim-immutable content.
- For archival republishes: lives under `src/data/blog/_<engine>/` (engine-of-origin grouping); opens with the stock stanza per `project_archive_stanza.md`.

**Don't pin** `pubDatetime` or `modDatetime` to local-branch commits — both are live-site moments. See `feedback_post_datetime_semantics.md`. Use a future `pubDatetime` (the scheduled-publication target) as both the gate and the placeholder; bump it if the PR slips. Pick the *nearest* cadence-appropriate publication day (Tuesday / Sunday), not a padded-out one — `SITE.scheduledPostMargin` is ~15 minutes, so the date is the actual publish target and earns no review buffer.

## When to invoke

- New post from a `## Spark` idea issue: `/draft-post #N` (reads the issue, treats Spark/open-questions as the kernel).
- Revising an in-progress draft (voice pass + frontmatter finalisation).
- Adding citation backing to an existing draft (Readwise/Reader search).

## Output

Iterate in the file directly. User reviews in place. Commit incrementally — each substantive change as its own commit with the reasoning in the body.

Final state before promoting the PR out of draft:

- Title, description, slug match the body.
- `pubDatetime` set to a future Tuesday or Sunday at 08:00 local.
- Vale + markdownlint pass via `pre-commit run --files <path>`.
- `pnpm build` clean.
- No links in body point at private Reader URLs.
