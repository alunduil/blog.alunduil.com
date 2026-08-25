---
name: tag-suggest
description: Propose 2–3 frontmatter tags for a draft blog post. Scans existing tags across `src/data/blog/**/*.md`, prioritises existing matches, flags morphological near-duplicates, justifies any net-new tag. Proposes first; only writes to the file after explicit author confirmation. Use via `/tag-suggest <path>` or omit the path to default to the currently staged/modified post.
---

# Tag-suggest

Pipeline: **resolve target → enumerate corpus → propose → confirm → apply**. The proposal is always presented before any file write; the apply step only runs after the author confirms.

## 1. Resolve target

- Path argument given: use it.
- No argument: pick the `.md` under `src/data/blog/` from `git status --porcelain` (staged or modified). If zero matches or more than one, ask.

## 2. Enumerate corpus

```bash
find src/data/blog -name '*.md' -type f \
  | while read -r f; do yq --front-matter=extract '.tags[]' "$f" 2>/dev/null; done \
  | sort | uniq -c | sort -rn
```

`yq --front-matter=extract` reads only the YAML between the opening and closing `---` lines, so a `tags:` block appearing in the post body (e.g. inside a documentation code example) is correctly ignored. The query handles both list-form (`tags:\n  - foo`) and inline (`tags: [a, b]`) without case-splitting.

Scan the full corpus including `_<engine>/` archives. AstroPaper's loader excludes `_`-prefixed *filenames*, not directory descendants, so archived posts still contribute tags to `/tags/<tag>` pages. Filtering would lose signal about which topics already cluster.

## 3. Propose

Read the target post—frontmatter + body. Then propose **2–3 tags** subject to:

- **Existing matches win.** If `reading` covers the topic, propose `reading`.
- **Content topics only.** A tag answers "what is this post *about*?". See `feedback_tags_are_content_only.md`. Category, era, format, and draft state live in directory structure (`_hakyll/`) and schema fields (`draft`, `featured`).
- **Soft cap 3.** Propose only tags that earn their place; three is a ceiling.
- **Near-duplicate check.** Before proposing a net-new tag, scan the inventory for morphological neighbours: singular/plural (`book` vs `books`), gerund/noun (`reading` vs `reads`), hyphenation (`decision-making` vs `decisionmaking`), capitalisation (`Astro` vs `astro`). If a neighbour exists, justify why the new tag is meaningfully distinct or fold into the existing one.

## 4. Report + confirm

Output a chat-only report; the file write happens in §5, after the author confirms. Shape:

- **Target**—path + current `tags:` (if any).
- **Existing tag inventory (top ~10)**— `tag (N)` per line. Surface enough to ground the proposal; the author can ask for the full list if needed.
- **Proposed tags**—bullet list. For each: `tag-name`—short rationale (≤1 sentence). Mark existing matches as `existing, N posts`; mark net-new as `new` with the nearest inventory neighbour and why it doesn't fit.
- **Proposed frontmatter block**—fenced YAML showing what would be written:

  ```yaml
  tags:
    - tag-one
    - tag-two
    - tag-three
  ```

End with: **"Apply to `<path>`? [y/N]"** Wait for the author's response.

## 5. Apply (on confirm)

Only after an affirmative response (`y`, `yes`, `apply`, "go ahead", etc.):

```bash
yq --front-matter=process -i '.tags = ["tag-one", "tag-two", "tag-three"]' <path>
```

`yq --front-matter=process` rewrites only the frontmatter block, preserves key order, retains list-form output, and leaves the body untouched. If `tags:` is absent, yq appends a list-form block at the end of frontmatter. Quoted/escaped scalars in other fields (e.g. `description: "…\""`) are preserved verbatim.

On a non-affirmative or absent response, leave the file alone and end. Author can rerun later with edits to the proposal.

## Out of scope

- Corpus-wide tag audit (single-occurrence singletons, all near-duplicate pairs, drift across the whole inventory). File separately if it earns its place once the corpus grows past ~10 user-authored posts.
- Deterministic hygiene (lowercase enforcement, duplicate-within-post, naming style). Pre-commit hook territory; defer until drift is observable.
- Editing the body. The skill mutates `tags:` only.
