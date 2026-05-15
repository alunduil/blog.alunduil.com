---
name: tag-suggest
description: Propose 2–3 frontmatter tags for a draft blog post. Scans existing tags across `src/data/blog/**/*.md`, prioritises existing matches, flags morphological near-duplicates, justifies any net-new tag. Read-only — never mutates the post. Use via `/tag-suggest <path>` or omit the path to default to the currently staged/modified post.
---

# Tag-suggest

Pipeline: **resolve target → enumerate corpus → propose → report**. Read-only. Author copies the recommendation into frontmatter; the skill never writes.

## 1. Resolve target

- Path argument given: use it.
- No argument: pick the `.md` under `src/data/blog/` from `git status --porcelain` (staged or modified). If zero matches or more than one, ask.

## 2. Enumerate corpus

```bash
find src/data/blog -name '*.md' -type f -exec awk '
  /^tags:/ { in_tags=1; next }
  in_tags && /^  - / { sub(/^  - /,""); print; next }
  in_tags && /^[^ ]/ { in_tags=0 }
' {} + | sort | uniq -c | sort -rn
```

Scan the full corpus including `_<engine>/` archives and `examples/`. AstroPaper's loader excludes `_`-prefixed *filenames*, not directory descendants, so archived posts still contribute tags to `/tags/<tag>` pages. Filtering would lose signal about which topics already cluster.

Assumes list-form YAML (`tags:\n  - foo`). Inline `tags: [a, b]` is not used in this repo.

## 3. Propose

Read the target post — frontmatter + body. Then propose **2–3 tags** subject to:

- **Existing matches win.** If `reading` covers the topic, propose `reading`. Don't coin `reads` or `reading-method`.
- **Content topics only.** A tag answers "what is this post *about*?". Not category, era, format, draft state. See `feedback_tags_are_content_only.md`. Reject `archive`, `hakyll`, `2018`, `revisit`, `draft` — those signals live in directory structure (`_hakyll/`) or schema fields (`draft`, `featured`).
- **Soft cap 3.** Drop a marginal tag rather than padding to fill the cap.
- **Near-duplicate check.** Before proposing a net-new tag, scan the inventory for morphological neighbours: singular/plural (`book` vs `books`), gerund/noun (`reading` vs `reads`), hyphenation (`color-schemes` vs `colorschemes`), capitalisation (`Astro` vs `astro`). If a neighbour exists, justify why the new tag is meaningfully distinct or fold into the existing one.

Upstream tutorial posts contribute tags like `docs`, `release`, `FAQ`, `configuration`, `color-schemes`. Treat them as part of the inventory — they're rendered on the live site — but don't propose them for user-authored content unless the post is genuinely about that topic.

## 4. Report

Output a chat-only report. Don't edit the file. Shape:

- **Target** — path + current `tags:` (if any).
- **Existing tag inventory (top ~10)** — `tag (N)` per line. Surface enough to ground the proposal; the author can ask for the full list if needed.
- **Proposed tags** — bullet list. For each: `tag-name` — short rationale (≤1 sentence). Mark existing matches as `existing, N posts`; mark net-new as `new` with the nearest inventory neighbour and why it doesn't fit.
- **Copy this into frontmatter** — fenced YAML block ready to paste:

  ```yaml
  tags:
    - tag-one
    - tag-two
    - tag-three
  ```

End the report. Don't offer to edit the file; the rule of this skill is the author pastes.

## Out of scope

- Corpus-wide tag audit (single-occurrence singletons, all near-duplicate pairs, drift across the whole inventory). File separately if it earns its place once the corpus grows past ~10 user-authored posts.
- Mutating the post. The author owns the frontmatter; the skill recommends.
- Deterministic hygiene (lowercase enforcement, duplicate-within-post, naming style). Pre-commit hook territory; defer until drift is observable.
