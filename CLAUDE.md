# CLAUDE.md

Repo-local guide for Claude Code on this personal blog (AstroPaper +
GitHub Pages deploy on push to `main`).

## Portability

This repo is used from Claude Code on the web, where host-local config
isn't present: the global `~/.claude/CLAUDE.md` and the per-project memory
directory don't travel — only the checkout does. Keep durable conventions
(voice, process, project rules) in the repo: `.claude/skills/`, this file,
or `docs/`. Skills must stand alone — state what they rely on inline, and
treat host memory as local reinforcement, never the sole home for anything
the work needs.

## Posting convention

New posts live under `src/data/blog/`; archival republishes under
`src/data/blog/_<engine>/`. Publication is gated by `pubDatetime`: a
future date keeps the post hidden via AstroPaper's
`SITE.scheduledPostMargin`. **Never** set `draft: true` — merging the
PR accepts the editorial work, the future date defers publication.

### "How I X" series

Future entries title as `How I X (YYYY)` — year-stamped scales without
anniversary arithmetic. Cadence ties to substantive change in the
practice, not the calendar; the next entry is ready when reading the
prior one prompts "that's not how I do it any more." Don't add series
infrastructure (index page, schema field, milestone) until there are
3+ entries.

## AstroPaper upstream

The site is built on the [AstroPaper] theme, MIT-licensed. Treat as
upstream — don't refactor, rename, or reformat unless the change is the
point:

- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`,
  `src/utils/`, `src/content.config.ts` — theme code.
- `src/data/blog/adding-new-post.md`, `customizing-*.md`,
  `dynamic-og-images.md`, `how-to-*.md`, `predefined-color-schemes.md`,
  `setting-dates-via-git-hooks.md` — upstream tutorial posts.
- `src/data/blog/_releases/` — AstroPaper release notes.
- `src/data/blog/examples/` — upstream example drafts.

Customized and free to edit: `src/config.ts`, `src/constants.ts`,
`astro.config.ts`, new posts in `src/data/blog/`.

[AstroPaper]: https://github.com/satnaing/astro-paper

## Branches and deploy

- Default branch: `main`. PRs target `main`.
- Deploy runs on push to `main` (`.github/workflows/deploy.yml`).

## Digest skill

`.claude/skills/digest/` clusters a window of GitHub activity, Readwise
highlights, and Reader archives into themes that might seed posts. It
also runs an interactive Notion Media Log check-in: it asks what you're
currently reading/playing, infers completions from whatever dropped off
the active list, and writes the status changes back — surfacing each
completion as a review kernel. Invoke via
`/digest [Nd|Nw|Nm|Ny]` (defaults to `7d`). Promising kernels file as
issues with the `idea` template.

## Tag-suggest skill

`.claude/skills/tag-suggest/` proposes frontmatter tags for a draft
post — scans the corpus's existing tag inventory, prioritises reuse
over invention, flags morphological near-duplicates. Invoke via
`/tag-suggest <path>` (defaults to the currently staged post).
Proposes first, then applies to the file only after the author
confirms.

## Idea issues

`.github/workflows/labels.yml` auto-applies the `idea` label to any
issue whose body contains `## Spark` (the idea template's first
heading). No manual labeling needed when filing via the template.
