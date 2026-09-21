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
rather than a damaged `main`:

```bash
git merge astro-paper/main
```

Resolve in this blog's favour wherever the two disagree on something
chosen on purpose. Two of those a passing build hides:

- The loader glob in `src/content.config.ts` takes `.md` alone where
  upstream also takes `.mdx`. `src/pages/rss.xml.ts` and
  `src/pages/posts/[...slug]/index.md.ts` read `post.body` as raw
  Markdown, so MDX would reach feeds as raw source.
- The theme's sample posts are gone by choice. A merge restores them as
  new files rather than as conflicts.

## Verify

```bash
pnpm build
```

Then check that existing post links still resolve, that a future-dated
post produces no `dist/posts/<slug>/`, and that tag pages and search
list the posts they did before.
