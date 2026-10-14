# Adopt AstroPaper upstream changes

The theme is copied source rather than an installed package, so Renovate
advances the libraries in `package.json` and never the theme code.
Upstream fixes arrive by merging, the approach upstream itself documents
in [How to update dependencies of
AstroPaper](https://astro-paper.pages.dev/posts/how-to-update-dependencies/).

## Add the upstream remote

Git keeps remotes in local configuration, so run this once per clone,
including a Claude Code session on the web:

```bash
git remote add --no-tags astro-paper https://github.com/satnaing/astro-paper.git
```

`--no-tags` keeps the theme's release tags out of this repository's own
`1.0.x` ones.

A shallow clone can merge but not push the result, since GitHub needs
the upstream history the merge commit points into. Fetch it in full:

```bash
git fetch --unshallow astro-paper
```

## Review what upstream changed

```bash
git fetch astro-paper
git log --oneline "$(git merge-base HEAD astro-paper/main)..astro-paper/main"
```

The merge base is the upstream commit this blog last reconciled, so
every commit listed is one it has not adopted. Read those subjects
rather than a file diff, which mixes those changes together with this
blog's own divergence.

## Merge what this blog wants

Merge from a branch, so an unworkable result is a discarded branch
rather than a damaged `main`, and land the pull request as a merge
commit so `main` keeps upstream as a parent:

```bash
git merge astro-paper/main
```

Resolve in this blog's favour wherever the two disagree on something
chosen on purpose. Two of those a passing build hides:

- `src/pages/rss.xml.ts` takes each item's full body from
  `renderPostBodies` through its `content` field. A resolution that drops
  either line ships a feed of summaries.
- The theme's sample posts are gone by choice. A merge restores them as
  new files rather than as conflicts.

## Keep the merge commit through review

The next sync finds its merge base through the upstream parent of this
merge commit, so the commit has to reach `main` intact. The pull request
merges by merge commit, which keeps it.

Fixes made after the merge, such as deleting restored sample posts, go
in their own commits after it. Fold review fixes into those commits
without flattening the merge:

```bash
GIT_SEQUENCE_EDITOR=true git rebase --interactive --autosquash --rebase-merges origin/main
```

Rewriting the branch recreates the merge, and any conflict resolved
inside it comes back. Enable `git config rerere.enabled true` before
merging so Git replays the resolution.

## Verify

```bash
pnpm build
```

Then check that existing post links still resolve, that a future-dated
post produces no `dist/posts/<slug>/`, and that tag pages and search
list the posts they did before.
