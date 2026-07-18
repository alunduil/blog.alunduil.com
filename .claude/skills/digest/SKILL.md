---
name: digest
description: Weekly (or arbitrary cadence) review of GitHub activity, Readwise highlights, and Reader archives, plus an interactive Notion Media Log check-in (asks what you're currently reading/playing, infers completions from whatever dropped off the active list, and records the status changes) — surfaces raw material for brainstorming blog posts. Use via /digest [cadence] where cadence is `Nd|Nw|Nm|Ny` (e.g. `7d`, `4w`, `6m`); defaults to `7d` when no cadence is given. Output is thematically clustered in chat; the only side effects are Media Log status updates you confirm and idea issues on request. Promising kernels → `gh issue create --label idea`.
---

# Digest

Pipeline: **collect → analyze data (incl. Media Log check-in) → synthesize themes → analyze themes → present**. Each stage has a different owner; don't smear them. The Media Log check-in is the one interactive, write-back step — everything else is read-only.

**Hard gate: the check-in blocks synthesis.** Present the reading and gaming questions *alone*, as the only content of their message, and stop. Do not synthesize, score, or print a single theme until the author has answered — completions from the check-in add and reshape themes, so any themes shown first are wrong and bury the questions the author needs to see.

## 1. Collect (script)

```bash
bash .claude/skills/digest/collect.sh "$cadence"
```

The script owns cadence parsing, the `gh` query fan-out, heuristic noise filters (squash-merge dupes, `alunduil/alunduil-claustre-state` sync noise, `task/*` + `release-please--*` agent branches), URL→repo parsing, truncation detection, and the per-repo rollup. Exits non-zero with a stderr message on invalid cadence. The digest is stateless: each run resolves `since` from the cadence alone, so a few days of boundary overlap between back-to-back digests is expected and fine.

JSON shape:

```json
{
  "window": {
    "since": "YYYY-MM-DD", "now": "ISO-8601-UTC",
    "events_included": true,
    "limit": 300, "truncated": ["issues_opened", ...]
  },
  "repos": {
    "owner/repo": {
      "commits": N, "prs_opened": N, "prs_reviewed": N,
      "issues_opened": N, "issues_closed": N, "commented": N,
      "days_active": ["YYYY-MM-DD", ...]
    }
  },
  "commits": [...], "prs_opened": [...], "prs_reviewed": [...],
  "issues_opened": [...], "issues_closed": [...],
  "commented": [...], "events": [...]
}
```

## 2. Analyze data (Claude pre-synthesis)

Fetch Readwise + Reader for the same window via MCP (using `window.since`, append `T00:00:00Z`), then run the Media Log check-in:

- `readwise_list_highlights` — `highlighted_at_gt=<since>T00:00:00Z`, `page_size=100`, `response_fields=["text","note","url","highlighted_at","book_title","book_author"]`.
- `reader_list_documents` — `location="archive"`, `updated_after=<since>T00:00:00Z`, `limit=100`, `response_fields=["title","author","source","url","last_moved_at","saved_at","category","first_opened_at"]`. **No category filter** — Reader's save/dismiss flow already filters at feed-time, so archive = engaged-with.

**Notion Media Log check-in** — the one place the digest *writes*. Two trackers; the digest touches **only** `Title` + `Status` (one of `Active` / `Finished` / `Abandoned`) and leaves any other columns the author keeps (Playing carries `Platform`, hours, `% Done`, etc.) untouched:

- Reading (books): `collection://886930b5-cd2e-4528-afe3-0bb6eb1bb8e1`
- Playing (games): `collection://a37ceaff-e104-4298-b117-aa6ca386a0e6`

Don't *detect* completions by querying — derive them from one "what's active now?" answer per source. But a drop is not automatically a completion: a title the author put down to resume later is on **hiatus** and stays Active. Never auto-Finish a drop — confirm its disposition first. Before synthesis:

1. **Read current Active** (best-effort): per source, `notion-search` `data_source_url=<collection>` (`query` a domain term like `"book"`/`"video game"`), `notion-fetch` the hits, keep `Status = Active` → the *known-active* set. This read can't filter on `Status` server-side, so recall is best-effort — a row it misses just won't be offered this run (stays Active until it surfaces). Self-healing gap, never silent data loss.
2. **Prompt and stop** (one question per source, free-form): show the known-active titles and ask "what are you actually engaged with right now — and did you finish, abandon, or set aside for later any of the rest?" These two questions are the *entire* message — no themes, no digest, nothing after them. Wait for the author's reply before doing anything else.
3. **Classify drops, then write back** (`notion-update-page`, `command="update_properties"`). Every known-active title absent from the answer is a **drop** — but a "currently reading/playing" list omits hiatus titles too, so the drop set mixes finished, abandoned, and hiatus. Resolve each drop to a disposition from the author's reply; if the reply doesn't say, **ask** before writing (a wrong Finish needs a manual revert):
   - **finished** → `"Status":"Finished"` (no date — Status is the whole record).
   - **abandoned** → `"Status":"Abandoned"`.
   - **hiatus** (put down, will resume) → **leave Active, no write.**
   - answer item **not** in known-active → **newly started**: `notion-search` the source by exact title (precise even in a large table) → flip an existing row to `"Status":"Active"`, or `notion-create-pages` under the `data_source_id` if none exists.
   - in both → unchanged.
4. Show the derived diff (finished / abandoned / hiatus-unchanged / started / unchanged) and confirm in one line before moving on.

Each item marked **Finished** this run is a **completion** kernel for synthesis (review/commentary, almost always `[short]` — see §4). **Abandoned** items are just recorded — a did-not-finish can still seed commentary, but only if the author calls it out. Still-active and newly-started items are light "currently reading/playing" context, not kernels alone, but they color adjacent themes (e.g. a game whose mechanics echo a work post).

If a source's MCP is unavailable, note which (e.g. "Notion Media Log unavailable — skipped check-in") and continue with the rest.

Mechanical patterns to extract before synthesis:

- **Cross-source links**: archived Reader docs whose `url` matches a Readwise highlight → tag `has_highlights = true`. A highlight is a stronger engagement signal than archive alone.
- **Completion arcs**: issues that appear in both `issues_opened` and `issues_closed` within the window, plus Media Log items marked `Finished` in this run's check-in. Narrative-ready ("started and finished this week"; "finished this book/game — worth a review").
- **Cross-project signals**: use `repos[].days_active` to spot repos with simultaneous activity bursts. Same kind of work hitting multiple repos on the same days is often a single underlying decision worth surfacing.
- **Truncation**: if `window.truncated` is non-empty (excluding `commits`-only — squash-dedup destroys most raw items so commits-only truncation is usually noise), surface as a warning above the themed clusters.

## 3. Synthesize themes (Claude)

Cluster items across all sources into **4–8 themes** that might seed a blog post. Don't enumerate everything. Each theme:

- 1–2 sentence summary of what makes it interesting.
- Bullet list of supporting items (link + terse identifier), ordered **neutrally** — date desc within the theme. **No engagement weighting at this layer.**
- If a theme's tail exceeds ~10 items, collapse with `+N more — see <gh query | url>`.

Direct-to-trunk commits and merged PRs are equivalent for clustering and ranking — pair-heavy repos use direct writes interchangeably with PRs.

## 4. Analyze themes (Claude)

Score each theme by signal-of-engagement-with-the-topic, present themes in descending score. Engagement is at the topic layer, not the item layer:

- **Source breadth**: how many of {commits, PRs, issues_opened, issues_closed, comments, highlights, archives} contribute. Theme spanning 4+ sources beats theme drawn from one.
- **Cross-source resonance**: theme has both a GitHub item AND a Readwise highlight on the same topic. External validation. Heavy weight.
- **Completion arc presence**: theme contains an opened+closed issue, a merged PR-with-explicit-Closes, or a finished book/game. Narrative-ready, easier to write.
- **Time span**: spans the whole window > single-day burst (sustained interest > momentary distraction).
- **Cross-project**: same theme across multiple repos = pattern at a higher altitude, often the post-worthy angle.
- **Volume**: tiebreaker only. More items ≠ inherently more interesting.

After scoring, tag each theme **short** or **long** by shape (independent of score):

- **short** — single idea worth amplifying. External quote/highlight + a paragraph of own commentary. No narrative arc, no walk-through. Themes dominated by one strong cross-source link with little code activity usually land here, as do most finished-book/game reviews.
- **long** — multi-step narrative, how-to, tutorial, or explanation that names a pattern with a worked example. Themes with completion arcs, cross-project sweeps, or pipeline/architecture decisions usually land here.

A theme can warrant both — a short signal-boost now and a long synthesis later. Say so.

## 5. Present + wait

Only reachable once the check-in (§2) is answered and written back. Print the themed digest to chat. Truncation warning (if any) above clusters. Prefix each theme heading with its form tag, e.g. `## 1. [long] Claude/agent tooling buildout...`. End with empty `## Idea kernels` section.

Wait for the author's call on each theme:

- "file idea X" (one or many) → file each via `gh issue create --label idea --title "<outcome>"`, pass `--body` directly with Spark / Why interesting / Open questions / Source material filled from conversation. The idea template auto-applies its labels; don't pass `--template` alongside `--body` (gh rejects the combination).
- Themes that map to an existing open `idea`-labeled issue (check `gh issue list --label idea --state open`) → add a comment with the new material rather than filing a duplicate.
- Anything else (silence, "let me think", "re-run") → drop it; next digest will rediscover anything still relevant.

Skipped ≥2 weeks? Pass an explicit cadence (`/digest 3w`) — the default is 7d.
