---
name: digest
description: Weekly (or arbitrary cadence) review of GitHub activity, Readwise highlights, and Reader archives — surfaces raw material for brainstorming blog posts. Use via /digest [cadence] where cadence is `Nd|Nw|Nm|Ny` (e.g. `7d`, `4w`, `6m`) or `last` (default — reads `.claude/skills/digest/last-run`, falls back to `1w` with a warning if absent). Output is chat-only, thematically clustered. Promising kernels → `gh issue create --template idea`.
---

# Digest

## Flow

### 1. Collect GitHub data via the script

```bash
bash .claude/skills/digest/collect.sh "$cadence"
```

The script owns cadence parsing, `last-run` reads, the `gh` query fan-out, and heuristic filters (squash-merge dupes, `alunduil/alunduil-claustre-state` sync noise, `task/*` + `release-please--*` agent branches, URL→repo parsing, events-window-too-wide). It exits non-zero with a stderr message on invalid cadence.

Capture stdout and parse as JSON:

```json
{
  "window": {
    "since": "YYYY-MM-DD", "now": "ISO-8601-UTC",
    "events_included": true,
    "limit": 300, "truncated": ["issues_opened", ...]
  },
  "commits": [...], "prs_opened": [...], "prs_reviewed": [...],
  "issues_opened": [...], "issues_closed": [...],
  "commented": [...], "events": [...]
}
```

**If `window.truncated` is non-empty**, surface it in the digest output above the themed clusters: "⚠️ Truncated at limit (300): `<source>`. Narrow the window or raise `LIMIT` if completeness matters this week." The `commits` source often appears here even on light weeks because many raw commits are squash-merge dupes the filter strips — note this if commits is the only entry, since the items you'd be missing are likely also noise.

### 2. Fetch Readwise + Reader for the same window via MCP

Use `window.since` (append `T00:00:00Z` for ISO-8601):

- `readwise_list_highlights` — `highlighted_at_gt=<since>T00:00:00Z`, `page_size=100`, `response_fields=["text","note","url","highlighted_at","book_title","book_author"]`.
- `reader_list_documents` — `location="archive"`, `updated_after=<since>T00:00:00Z`, `limit=100`, `response_fields=["title","author","source","url","last_moved_at","saved_at","category","first_opened_at"]`. **No category filter** — Reader's save/dismiss flow already filters at feed-time, so archive = read-with-intent.

If MCP tools are unavailable on this machine, note "Readwise/Reader unavailable — GitHub-only digest" and continue.

Cross-reference: for each archived doc, set `has_highlights = true` if any highlight's `url` matches the doc's `url`. Use as a soft signal in synthesis (highlighted reads weight higher than skim-and-archive).

### 3. Cluster thematically across all sources

Pick **4–8 themes** that might seed a blog post. Don't enumerate everything. Each theme:

- 1–2 sentence summary of what's interesting.
- Bullet list of supporting items (link + terse identifier).
- Order items by engagement weight: direct-to-trunk commits > merged PRs > comments; highlighted Reader docs > unhighlighted articles > RSS items.
- If a single theme's tail exceeds ~10 items, collapse with `+N more — see <gh query | url>`.

### 4. Print the themed digest to chat

End with an empty `## Idea kernels` section.

### 5. Wait for a positive-value signal before writing `last-run`

- "no kernels here" / "nothing of interest" → write `window.now` to `.claude/skills/digest/last-run`.
- "file idea X" (one or many) → file each via `gh issue create --template idea --label idea --title "<outcome>"`, pass `--body` directly with Spark / Why interesting / Open questions / Source material filled from conversation. Then write `last-run`.
- Anything else (silence, "let me think", "re-run") → don't write.

After writing, end with one line: `last-run updated to <now> — git add/commit when ready.`

`last-run` is tracked so a fresh checkout or worktree shares it.
