# CLAUDE.md

Claude Code reads this file instead of `AGENTS.md`, so this file imports
it. Add a rule here only when no other agent needs it.

@AGENTS.md

## Portability

This repo is used from Claude Code on the web, where host-local config
isn't present: the global `~/.claude/CLAUDE.md` and the per-project memory
directory don't travel — only the checkout does. Keep durable conventions
(voice, process, project rules) in the repo: `AGENTS.md`, `.claude/skills/`,
or `docs/`. Skills must stand alone — state what they rely on inline, so
host memory only reinforces what the repo already carries.

## Voice

`.claude/voice.md` is distinct from the host `~/.claude/voice.md`, which
profiles the author's external PR/issue voice against a different corpus.

## Force-push handoff

Hand the author the branch-curation push as
`! git push --force-with-lease`. The `!` prefix runs it in this session.

## Skills

Custom skills under `.claude/skills/`; each SKILL.md frontmatter is the
authoritative description. The writing pipeline:

- `outline-draft` → `post-draft` — story posts: a scene-and-beat outline
  gated at approval, then prose. `/outline-draft [#N]`, `/post-draft <slug>`.
- `review-draft` — book/paper/game reviews (a claim and its evidence), a
  sibling of the story pipeline. `/review-draft [#N|title|path]`.

Utilities:

- `digest` — cluster a window of GitHub, Readwise, Reader, and Todoist
  activity, plus a check-in on the Readwise Books shelves and the Notion
  Media Log's games, into post kernels.
  `/digest [Nd|Nw|Nm|Ny]` (default `7d`).
- `tag-suggest` — propose frontmatter tags for a draft; applies only
  after confirmation. `/tag-suggest <path>`.
- `syndicate-instagram` — hand-crafted Instagram post from a published
  post (the one surface not auto-syndicated by dlvr.it).
  `/syndicate-instagram [path|slug|url]`.

The writing skills draw from the post references under Posting
convention in `AGENTS.md`.
