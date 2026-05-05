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

- Default branch: `develop`. PRs target `develop`.
- Deploy runs on push to `main` (`.github/workflows/deploy.yml`). `main`
  doesn't exist yet — first publish creates it from `develop`.

## Digest skill

`.claude/skills/digest/` clusters a window of GitHub activity, Readwise
highlights, and Reader archives into themes that might seed posts.
Invoke via `/digest [Nd|Nw|Nm|Ny|last]`. Promising kernels file as
issues with the `idea` template.

## Idea issues

`.github/workflows/labels.yml` auto-applies the `idea` label to any
issue whose body contains `## Spark` (the idea template's first
heading). No manual labeling needed when filing via the template.
