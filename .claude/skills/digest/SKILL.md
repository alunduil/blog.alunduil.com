---
name: digest
description: Weekly (or arbitrary cadence) review of GitHub activity, monthly milestones across every Inbox repo, Readwise highlights, Reader archives, and Todoist completions and upcoming tasks, plus an interactive check-in on books (Readwise Books) and games (Notion Media Log) that asks what you're currently reading/playing, infers completions from whatever dropped off the active list, and records the changes — surfaces raw material for brainstorming blog posts. Use via /digest [cadence] where cadence is `Nd|Nw|Nm|Ny` (e.g. `7d`, `4w`, `6m`); defaults to `7d` when no cadence is given. Output is thematically clustered in chat with a milestone lookback and milestone-system findings; the only side effects are book shelf and game status updates and milestone key-result scores you confirm, plus idea or milestone-system issues and Todoist tasks on request. Promising kernels → `gh issue create --label idea`.
---

# Digest

Pipeline: **collect → analyze data (incl. reading and playing check-in, milestone scoring, and milestone lookback) → synthesize themes → analyze themes → present**. Each stage has a different owner; keep them separate. The check-in and milestone scoring are the interactive write-back steps, and §5 writes Todoist tasks on request. Everything else is read-only.

**Hard gate: the interactive steps block synthesis.** Present the reading and gaming questions *alone*, as the only content of their message, and stop. Ask the review question (§2 step 5) and send the milestone scoring proposals (§2) the same way. Synthesize, score, and print themes once the author has answered. Completions from the check-in add and reshape themes, and holding the themes back keeps the questions visible.

## 1. Collect (script)

```bash
bash .claude/skills/digest/collect.sh "$cadence"
```

The script owns cadence parsing, the `gh` query fan-out, heuristic noise filters (commits a merged PR already stands for, `alunduil/alunduil-claustre-state` sync noise, `task/*` + `release-please--*` agent branches), URL→repo parsing, truncation detection, and the per-repo rollup. It also reads milestones and in-window closed issues from every repo under `alunduil`, `dungeon-studio`, and `qua-world` (the Inbox board). Exits non-zero with a stderr message on invalid cadence. The digest is stateless: each run resolves `since` from the cadence alone, so a few days of boundary overlap between back-to-back digests is expected and fine.

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
  "milestones": {
    "milestones": [{
      "repo": "owner/repo", "number": N, "title": "YYYY-MM: <objective>",
      "state": "open|closed", "url": "...", "closed_at": "ISO-8601|null",
      "open_issues": N, "closed_issues": N, "closed_in_window": N,
      "key_results": N, "key_results_done": N, "score": "N/M|null"
    }],
    "closed_in_window": {"owner/repo": N}
  },
  "commits": [...], "prs_opened": [...], "prs_reviewed": [...],
  "issues_opened": [...], "issues_closed": [...],
  "commented": [...], "events": [...]
}
```

## 2. Analyze data (Claude pre-synthesis)

Fetch Readwise, Reader, and Todoist for the same window via MCP (using `window.since`, append `T00:00:00Z`), then run the reading and playing check-in:

- `readwise_list_highlights` — `highlighted_at_gt=<since>T00:00:00Z`, `page_size=100`, `response_fields=["text","note","url","highlighted_at","book_title","book_author"]`.
- `reader_list_documents` — `location="archive"`, `updated_after=<since>T00:00:00Z`, `limit=100`, `response_fields=["title","author","source","url","last_moved_at","saved_at","category","first_opened_at"]`. **Omit the category filter** — Reader's save/dismiss flow already filters at feed-time, so archive = engaged-with.
- Todoist completions — `user-info` for the author's `userId` and timezone, then `find-activity` with `objectType="task"`, `eventType="completed"`, `initiatorId=<userId>`, `dateFrom=<since>T00:00:00Z`, `dateTo=<window.now>`, `limit=100`, paging on `cursor`.
- Todoist plans — `find-tasks-by-date` with `startDate="today"`, `daysCount=14`, `limit=100`: overdue and upcoming tasks. Planning context for themes, never a kernel by itself.

**Reading and playing check-in** — derive completions from one "what's active now?" answer per source. Every known-active title absent from the answer is a **drop**, and resolves to one of three dispositions: finished, abandoned, or **hiatus** — a title the author put down to resume later.

**Books — Readwise Books (`books_*` tools).** The digest writes only `status`, `started_reading_at`, and `finished_reading_at`, and leaves rating, review, and page counts to the author.

- *Known-active*: `books_list_books` `status="currently_reading"`.
- *On hiatus*: `want_to_read` books with a `started_reading_at`, a non-null `progress`, or sessions. The rest of `want_to_read` is unstarted.
- *Settled*: shelf moves the author made in the Readwise app during the window. Read them with `books_list_books` `order="updated"`, `updated_after=<since>T00:00:00Z`, keeping books whose `status_changed_at` falls in the window. Report them; don't ask about them.
- Writes, in one `books_update_books` call; check each item's result `status`:
  - **finished** → `status="finished"`, `finished_reading_at` = the day the author names, else the check-in time.
  - **abandoned** → `status="did_not_finish"`.
  - **hiatus** → `status="want_to_read"`, keeping `started_reading_at` and progress, which mark it as on hiatus.
  - **resumed** from hiatus → `status="currently_reading"`.
  - **newly started** → find it with `books_list_books` (ISBN or ASIN when known, else scan by title) → `status="currently_reading"` with `started_reading_at`; when the library lacks it, `books_create_books` with `status="currently_reading"`, identifying the book by `isbn` first, then `asin`, then `title` with `author`.

**Games — Notion Playing tracker (`collection://a37ceaff-e104-4298-b117-aa6ca386a0e6`).** The digest touches **only** `Title` + `Status` (one of `Active` / `Finished` / `Abandoned`) and leaves the other columns (`Platform`, hours, `% Done`, etc.) untouched.

- *Known-active* (best-effort): `notion-search` `data_source_url=<collection>` (`query` `"video game"`), `notion-fetch` the hits, keep `Status = Active`. This read can't filter on `Status` server-side, so a row it misses won't be offered this run and stays Active until it surfaces.
- Writes (`notion-update-page`, `command="update_properties"`):
  - **finished** → `"Status":"Finished"`.
  - **abandoned** → `"Status":"Abandoned"`.
  - **hiatus** → leave Active, no write.
  - **newly started** → `notion-search` by exact title → flip an existing row to `"Status":"Active"`, or `notion-create-pages` under the `data_source_id` if none exists.

Before synthesis:

1. **Read** each source's known-active set, plus the books on hiatus and the settled books.
2. **Prompt and stop** (one question per source, free-form): show the known-active titles and ask "what are you actually engaged with right now — and did you finish, abandon, or set aside for later any of the rest?" For books, also list the books on hiatus and ask whether any resumed. These two questions are the *entire* message — no themes, no digest, nothing after them. Wait for the author's reply before doing anything else.
3. **Classify, then write back.** A "currently reading/playing" list omits hiatus titles too, so the drop set mixes finished, abandoned, and hiatus. Resolve each drop to a disposition from the author's reply; if the reply doesn't say, **ask** before writing (a wrong Finish needs a manual revert). An answer title outside the known-active set is **newly started**; a title in both is unchanged. Apply the source's writes.
4. Show the derived diff (finished / abandoned / hiatus / resumed / started / unchanged, plus the settled books) and confirm in one line before moving on.
5. **Run `review-draft`'s gate while the work is fresh.** If anything finished — in this check-in or among the settled books — send one more message listing those titles and asking `review-draft` §1's question for each; for a magazine or anthology issue, ask which story carries it. Wait for the reply and apply §1's go/no-go.

A **finished** item that passes the gate is a **completion** kernel for synthesis (review, almost always `[short]` — see §4); its answer goes verbatim into the idea issue's Spark. One that fails stays a shelf or Media Log entry. **Abandoned** items are just recorded — a did-not-finish can still seed commentary, but only if the author calls it out. Still-active and newly-started items are light "currently reading/playing" context that colors adjacent themes (e.g. a game whose mechanics echo a work post).

If a source's MCP is unavailable, note which (e.g. "Readwise Books unavailable — skipped the book check-in") and continue with the rest.

Mechanical patterns to extract before synthesis:

- **Cross-source links**: archived Reader docs whose `url` matches a Readwise highlight → tag `has_highlights = true`. A highlight is a stronger engagement signal than archive alone.
- **Completion arcs**: issues that appear in both `issues_opened` and `issues_closed` within the window, plus books and games finished in this run's check-in, plus Todoist tasks completed in the window that close out work the other sources show. Narrative-ready ("started and finished this week"; "finished this book/game — worth a review").
- **Cross-project signals**: use `repos[].days_active` to spot repos with simultaneous activity bursts. Same kind of work hitting multiple repos on the same days is often a single underlying decision worth surfacing.
- **Truncation**: if `window.truncated` is non-empty (excluding `commits`-only — PR dedup destroys most raw items so commits-only truncation is usually noise), surface as a warning above the themed clusters.

### Milestone scoring

Score after the review gate and before the lookback, so a milestone this step completes counts as an objective arc. Score open milestones with `closed_in_window > 0` and `key_results_done < key_results`:

1. Read the milestone's description: `gh api repos/<repo>/milestones/<number> --jq .description`.
2. For each unticked key result, run or read the check it names, such as a command, a live query, or a count across repos. Closed issues and merged PRs support a score; the check decides it.
3. Propose a tick (1.0) or a partial score per key result, with its evidence: the command and its output, or the issue or PR. Leave a key result unscored when its check can't run this session, and say why.
4. Send the proposals under the hard gate. For each confirmed score, tick a 1.0 or append ` — 0.5` to its line, then write the edited description back: `gh api -X PATCH repos/<repo>/milestones/<number> -f description="<edited description>"`.

### Milestone lookback

A milestone is one objective for one month in one repo, titled `YYYY-MM: <objective>`. Identical titles in different repos are separate milestones. The month orders objectives; it is not a deadline. The `milestones` skill in `alunduil/alunduil-chezmoi` (`dot_claude/skills/milestones/SKILL.md`) defines the rest: an `As measured by:` checklist of two or three key results, a `Scored N/M key results.` line on close, and velocity sized from past scores.

`milestones.milestones` holds the `YYYY-MM:` milestones open now or closed in the window. Both `closed_in_window` counts, per milestone and per repo, cover issues closed as completed. A repo's closes outside objectives are its total minus its milestones' sum.

Build two outputs from `milestones`:

1. **Lookback.** Per repo with movement: milestones closed in the window with their score, key results ticked, and `closed_in_window`. Name repos whose milestones did not move. A milestone closed or with every key result ticked in the window is an **objective arc**, a completion arc whose objective sentence is the candidate moment of change for §4's screen.
2. **System findings.** Measured patterns in how the milestone system is working, each with its evidence (repo, milestone, number):
   - **Velocity.** Completed closes inside objectives against outside them, overall and per repo; key results ticked; scores of milestones closed in the window. Measure across all repos together, because they share one person's capacity. Name repos whose closes sit mostly outside objectives.
   - **Format drift.** Milestones with `key_results == 0`: no checklist to tick or score.
   - **Unscored close.** A closed milestone with a null `score`.
   - **Open past target month.** Report it as a neutral fact with its open count.
   - **Stalled.** Open issues and `closed_in_window == 0` in a milestone whose month has arrived.

   Before presenting, search open and closed issues in `alunduil/alunduil-chezmoi` (`gh search issues --repo alunduil/alunduil-chezmoi milestone --json number,title,state`) and attach any match to the finding it covers.

## 3. Synthesize themes (Claude)

Cluster items across all sources into **4–8 themes** that might seed a blog post. Select the strongest signals. Each theme:

- 1–2 sentence summary of what makes it interesting.
- Bullet list of supporting items (link + terse identifier), ordered **neutrally** — date desc within the theme. Engagement weighting happens in §4.
- If a theme's tail exceeds ~10 items, collapse with `+N more — see <gh query | url>`.

Direct-to-trunk commits and merged PRs are equivalent for clustering and ranking — pair-heavy repos use direct writes interchangeably with PRs.

## 4. Analyze themes (Claude)

Score each theme by signal-of-engagement-with-the-topic, present themes in descending score. Engagement is at the topic layer, not the item layer:

- **Source breadth**: how many of {commits, PRs, issues_opened, issues_closed, comments, highlights, archives, Todoist completions} contribute. Upcoming Todoist tasks don't count toward breadth; note them on the theme as already planned. Theme spanning 4+ sources beats theme drawn from one.
- **Cross-source resonance**: theme has both a GitHub item AND a Readwise highlight on the same topic. External validation. Heavy weight.
- **Completion arc presence**: theme contains an opened+closed issue, a merged PR-with-explicit-Closes, an objective arc, or a finished book/game. Narrative-ready, easier to write.
- **Time span**: spans the whole window > single-day burst (sustained interest > momentary distraction).
- **Cross-project**: same theme across multiple repos = pattern at a higher altitude, often the post-worthy angle.
- **Volume**: tiebreaker only.

After scoring, tag each theme **short** or **long** by shape (independent of score):

- **short** — single idea worth amplifying. External quote/highlight + a paragraph of own commentary. Themes dominated by one strong cross-source link with little code activity usually land here, as do most finished-book/game reviews.
- **long** — multi-step narrative, how-to, tutorial, or explanation that names a pattern with a worked example. Themes with completion arcs, cross-project sweeps, or pipeline/architecture decisions usually land here.

A theme can warrant both — a short signal-boost now and a long synthesis later. Say so.

**Screen each theme against the collected data before offering it as a kernel:**

- **Moment of change.** The post needs a point where the author's practice or view changed. Name the candidate moment from the data for the author to confirm.
- **Not a corpus repeat.** Compare the landing sentence against published posts in `src/content/posts/`. The same conclusion pointed at a new target is a repeat.
- **Survives the wait.** A kernel tied to a live news event or an undecided downstream issue must be writable now, or framed so the outcome doesn't matter.

A theme that fails moves to a short **Screened out** list in §5 with its reason, so the author can overrule it. The checks that need source reads run at filing (§5).

## 5. Present + wait

Only reachable once every hard-gate message is answered and its writes are done. Print the themed digest to chat. Truncation warning (if any) above clusters. Prefix each theme heading with its form tag, e.g. `## 1. [long] Claude/agent tooling buildout...`. After the themes, a `## Screened out` list (one line each: theme, failed check, evidence), then `## Milestone lookback` and `## Milestone system` (§2). Number the findings and link any matching issue. End with empty `## Idea kernels` section.

Wait for the author's call on each theme:

- "file idea X" (one or many) → for each, in order:
  1. Search open and closed `idea` issues: `gh search issues --repo alunduil/blog.alunduil.com --label idea --json number,title,state <keywords>`.
     - Open match → comment the new material on that issue and stop.
     - Not-planned match → read its closing comment. Continue only when the new material answers why it closed; link it in Source material.
  2. Run the source checks. A failure goes back to the author with the evidence instead of filing.
     - **Causality holds.** When the angle rests on an order of events ("X made Y possible"), the `merged_at` and touched files of the cited PRs and commits must support that order.
     - **The source hasn't written it.** When the theme leans on a highlight or article, the kernel must add lived material the source lacks.
  3. File via `gh issue create --label idea --title "<outcome>"`, passing `--body` directly with Spark / Why interesting / Open questions / Source material filled from conversation. The idea template auto-applies its labels; pass `--body` alone (gh rejects it alongside `--template`).
- "file milestone finding X" (one or many) → for each: an open match in `alunduil/alunduil-chezmoi` gets the new evidence as a comment; otherwise file there with `gh issue create --repo alunduil/alunduil-chezmoi --title "<outcome>"` and a body stating the observation, the evidence from this run, and the window. List proposed changes as open questions.
- "add task X" (one or many, e.g. drafting a filed idea or a review that passed the gate) → propose each task's `content`, project (default `"inbox"`), and due date, link the idea issue in `description`, and create them with one `add-tasks` call after the author confirms.
- Anything else (silence, "let me think", "re-run") → drop it; next digest will rediscover anything still relevant.

Skipped ≥2 weeks? Pass an explicit cadence (`/digest 3w`) — the default is 7d.
