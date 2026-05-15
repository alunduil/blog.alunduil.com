# CLAUDE.md

Repo-local guide for Claude Code. See `README.md` for the human-facing
posting flow (frontmatter, `pnpm dev`/`pnpm build`, `draft: true → false`
publish flip).

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
highlights, and Reader archives into themes that might seed posts.
Invoke via `/digest [Nd|Nw|Nm|Ny|last]`. Promising kernels file as
issues with the `idea` template.

## Tag-suggest skill

`.claude/skills/tag-suggest/` proposes frontmatter tags for a draft
post — scans the corpus's existing tag inventory, prioritises reuse
over invention, flags morphological near-duplicates. Invoke via
`/tag-suggest <path>` (defaults to the currently staged post).
Read-only; the author pastes the recommendation in.

## Idea issues

`.github/workflows/labels.yml` auto-applies the `idea` label to any
issue whose body contains `## Spark` (the idea template's first
heading). No manual labeling needed when filing via the template.
