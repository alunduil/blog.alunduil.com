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

- Package manager: pnpm. Version pinned in the withastro/action
  `package-manager:` field of `.github/workflows/ci.yml` and
  `pages.yml`, kept current by the Renovate custom manager in
  `renovate.json`. `pnpm-workspace.yaml` holds workspace config.
- Dev / build: `pnpm dev`, `pnpm build` (Astro; `build` also runs
  `astro check` and pagefind). AstroPaper theme — treat as upstream
  (see below).
- Lint / format via `pre-commit` (`.pre-commit-config.yaml`): Vale prose
  (`.vale.ini` + `.vale/`), markdownlint (`.markdownlint-cli2.yaml`),
  yamllint (`.yamllint`), actionlint, shellcheck/shfmt, ESLint and
  Prettier (`local` hooks running the repo's own binaries so their
  plugins/configs resolve from workspace deps), and baseline file
  hygiene. `pnpm lint` / `pnpm format` run the same tools by hand.
  Prettier owns `.ts`/`.js`/`.astro`/`.css`/`.json` only (scope in
  `.prettierignore`); markdown and YAML stay with their dedicated
  linters. The whole suite runs in CI via the `pre-commit` job in
  `ci.yml`, which installs Node/pnpm first for the ESLint/Prettier
  hooks. Excluded file types (no checker): binary assets
  (svg/png/webp), `lychee.toml`, `.vale.ini`. lychee link-checking is
  CI-only (the `lychee` job in `.github/workflows/ci.yml`,
  `lychee.toml`).
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

## GitHub Actions

Workflow and job names read as "when / what":

- Workflow `name:` is the when — the trigger or cadence (`CI`). A
  single-purpose file may take its subject (`Pages`, `Labels`) until
  something colocates with it. A file that can't take a cadence name
  without colliding with another's is usually a job, not a file.
- Job `name:` is the what — the outcome as a human-readable phrase
  (`Check links`, `Build the site`), legible standing alone in the
  required-checks picker.
- The job id (key under `jobs:`) is the kebab wiring identifier for
  `needs:` and reuse; the job `name:` is the status-check context branch
  protection matches. They differ by design.
- Job names are the scarce namespace: keep them unique repo-wide.
  `required_status_checks` in `alunduil/alunduil-infrastructure` pins
  them by string, so renaming one is a coordinated change with that repo.
- Split files on `on:` alone — the only setting that can't be scoped per
  job. Permissions, concurrency, env, and defaults push down to the job,
  so workflows sharing a trigger colocate as jobs in one file.
- A matrix job expands one context per cell; when one must be required,
  add a stable aggregator job and require that.

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
