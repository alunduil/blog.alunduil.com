---
name: digest
description: Weekly (or arbitrary cadence) review of GitHub activity, Readwise highlights, and Reader archives — surfaces raw material for brainstorming blog posts. Use via /digest [cadence] where cadence is `Nd|Nw|Nm|Ny` (e.g. `7d`, `4w`, `6m`); defaults to `7d` when no cadence is given. Output is chat-only, thematically clustered. Promising kernels → `gh issue create --label idea`.
---

# Digest

Pipeline: **collect → analyze data → synthesize themes → analyze themes → present**. Each stage has a different owner; don't smear them.

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

Fetch Readwise + Reader for the same window via MCP, using `window.since` (append `T00:00:00Z`):

- `readwise_list_highlights` — `highlighted_at_gt=<since>T00:00:00Z`, `page_size=100`, `response_fields=["text","note","url","highlighted_at","book_title","book_author"]`.
- `reader_list_documents` — `location="archive"`, `updated_after=<since>T00:00:00Z`, `limit=100`, `response_fields=["title","author","source","url","last_moved_at","saved_at","category","first_opened_at"]`. **No category filter** — Reader's save/dismiss flow already filters at feed-time, so archive = engaged-with.

If MCP unavailable, note "Readwise/Reader unavailable — GitHub-only digest" and continue.

Mechanical patterns to extract before synthesis:

- **Cross-source links**: archived Reader docs whose `url` matches a Readwise highlight → tag `has_highlights = true`. A highlight is a stronger engagement signal than archive alone.
- **Completion arcs**: issues that appear in both `issues_opened` and `issues_closed` within the window. Narrative-ready ("started and finished this week").
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
- **Completion arc presence**: theme contains an opened+closed issue or merged PR-with-explicit-Closes. Narrative-ready, easier to write.
- **Time span**: spans the whole window > single-day burst (sustained interest > momentary distraction).
- **Cross-project**: same theme across multiple repos = pattern at a higher altitude, often the post-worthy angle.
- **Volume**: tiebreaker only. More items ≠ inherently more interesting.

After scoring, tag each theme **short** or **long** by shape (independent of score):

- **short** — single idea worth amplifying. External quote/highlight + a paragraph of own commentary. No narrative arc, no walk-through. Themes dominated by one strong cross-source link with little code activity usually land here.
- **long** — multi-step narrative, how-to, tutorial, or explanation that names a pattern with a worked example. Themes with completion arcs, cross-project sweeps, or pipeline/architecture decisions usually land here.

A theme can warrant both — a short signal-boost now and a long synthesis later. Say so.

## 5. Present + wait

Print the themed digest to chat. Truncation warning (if any) above clusters. Prefix each theme heading with its form tag, e.g. `## 1. [long] Claude/agent tooling buildout...`. End with empty `## Idea kernels` section.

Wait for the author's call on each theme:

- "file idea X" (one or many) → file each via `gh issue create --label idea --title "<outcome>"`, pass `--body` directly with Spark / Why interesting / Open questions / Source material filled from conversation. The idea template auto-applies its labels; don't pass `--template` alongside `--body` (gh rejects the combination).
- Themes that map to an existing open `idea`-labeled issue (check `gh issue list --label idea --state open`) → add a comment with the new material rather than filing a duplicate.
- Anything else (silence, "let me think", "re-run") → drop it; next digest will rediscover anything still relevant.

Skipped ≥2 weeks? Pass an explicit cadence (`/digest 3w`) — the default is 7d.
