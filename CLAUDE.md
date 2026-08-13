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

## Tooling

This repo already wires the tooling below; consult it before adding or
scripting your own.

- Package manager: pnpm, pinned once in `package.json`'s `packageManager`
  field — Renovate tracks it there, and withastro/action reads it after
  auto-detecting `pnpm-lock.yaml`. `pnpm-workspace.yaml` holds workspace
  config.
- Dev / build: `pnpm dev`, `pnpm build` (Astro; `build` also runs
  `astro check` and pagefind). AstroPaper theme — treat as upstream
  (see below).
- Lint / format via `pre-commit` (`.pre-commit-config.yaml`): Vale prose
  (`.vale.ini` + `.vale/`), markdownlint (`.markdownlint-cli2.yaml`),
  yamllint (`.yamllint`), actionlint, shellcheck/shfmt, ESLint and
  Prettier (`local` hooks running the repo's own binaries so their
  plugins/configs resolve from workspace deps), and baseline file
  hygiene, plus lychee link-checking. `pnpm lint` / `pnpm format` run the
  same tools by hand.
  Prettier owns `.ts`/`.js`/`.astro`/`.css`/`.json` only (scope in
  `.prettierignore`); markdown and YAML stay with their dedicated
  linters. The whole suite runs in CI via `pre-commit.yml`, which
  installs Node/pnpm for the ESLint/Prettier hooks and lychee via
  `scripts/install-lychee.sh`. Excluded file types (no checker): binary
  assets (svg/png/webp), `lychee.toml`, `.vale.ini`.
- Link checking runs in two tiers, both configured by `lychee.toml`. The
  pre-commit hooks are `--offline`: blocking, but only on what resolves
  without a build. `weekly.yml` builds the site, checks every link on
  every published page plus the repo docs that never reach `dist/`,
  blocks nothing, and reports to one rolling issue. Adding to `exclude`
  takes a failing run plus proof from off the blocking host; the rule
  sits with the list.
- Custom skills under `.claude/skills/` — catalogued in the Skills
  section below; each SKILL.md frontmatter is the authoritative
  description.

## Scope discipline

Web sessions load neither the global guide nor the `issue-work` skill,
so the repo-relevant essentials:

- Keep each PR to its issue. Check scope against sibling and linked
  issues before opening; when unsure, ask.
- If an issue is blocked by an unshipped prerequisite, propose deferral
  with a `blocked-by` edge rather than writing premature code.
- Revert incidental out-of-scope edits before review, especially to the
  AstroPaper upstream files listed below.

## Posting convention

New posts live under `src/data/blog/`; archival republishes under
`src/data/blog/_<engine>/`; reviews under `src/data/blog/reviews/`.
Publication is gated by a future `pubDatetime`, never `draft: true` —
merging the PR accepts the editorial work, the date defers publication.

Frontmatter fields, the Tuesday (tech) / Sunday (reflective) 08:00
cadence, timezone, locations, cover images, and tags are documented in
`docs/reference/post-frontmatter.md`.

### "How I X" series

Future entries title as `How I X (YYYY)` — year-stamped scales without
anniversary arithmetic. Cadence ties to substantive change in the
practice, not the calendar; the next entry is ready when reading the
prior one prompts "that's not how I do it any more." Don't add series
infrastructure (index page, schema field, milestone) until there are
3+ entries.

## Voice

`.claude/voice.md` is the blog's voice home — the prescriptive rules to
apply and the descriptive fingerprint measured from the corpus. Read it
before drafting or editing any post. Distinct from the host
`~/.claude/voice.md`, which profiles the author's external PR/issue voice
against a different corpus.

## AstroPaper upstream

The site is built on the [AstroPaper] theme, MIT-licensed. Treat as
upstream — don't refactor, rename, or reformat unless the change is the
point:

- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`,
  `src/utils/`, `src/content.config.ts` — theme code.

The theme's sample posts (tutorials, release notes, example drafts) are
gone; `src/data/blog/` is all author content. What they documented about
post bodies lives in `docs/reference/post-body.md`.

Customized and free to edit: `src/config.ts`, `src/constants.ts`,
`astro.config.ts`, new posts in `src/data/blog/`.

[AstroPaper]: https://github.com/satnaing/astro-paper

## Branches and deploy

- Default branch: `main`. PRs target `main`.
- Deploy runs on push to `main` (`.github/workflows/pages.yml`).

## Skills

Custom skills under `.claude/skills/`; each SKILL.md frontmatter is the
authoritative description. The writing pipeline:

- `outline-draft` → `post-draft` — story posts: a scene-and-beat outline
  gated at approval, then prose. `/outline-draft [#N]`, `/post-draft <slug>`.
- `review-draft` — book/paper/game reviews (a claim and its evidence, not
  a scene arc), a sibling of the story pipeline.
  `/review-draft [#N|title|path]`.

Utilities:

- `digest` — cluster a window of GitHub, Readwise, and Reader activity,
  plus a Notion Media Log check-in, into post kernels.
  `/digest [Nd|Nw|Nm|Ny]` (default `7d`).
- `tag-suggest` — propose frontmatter tags for a draft; applies only
  after confirmation. `/tag-suggest <path>`.
- `syndicate-instagram` — hand-crafted Instagram post from a published
  post (the one surface not auto-syndicated by dlvr.it).
  `/syndicate-instagram [path|slug|url]`.

Shared conventions the writing skills draw from: `.claude/voice.md`
(voice), `.claude/citations.md` (citations),
`docs/reference/post-frontmatter.md` (frontmatter, scheduling, tags), and
`docs/reference/post-body.md` (images, table of contents, code blocks).

## Idea issues

`.github/workflows/labels.yml` auto-applies the `idea` label to any
issue whose body contains `## Spark` (the idea template's first
heading). No manual labeling needed when filing via the template.
