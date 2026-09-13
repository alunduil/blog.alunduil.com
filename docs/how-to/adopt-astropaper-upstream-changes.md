# Adopt AstroPaper upstream changes

This guide sets up a git remote for the AstroPaper theme and walks the
cycle of reviewing what upstream has changed and merging what this blog
wants. It covers the theme source only. Renovate already tracks the
libraries in `package.json`, and it never touches theme code.

The theme arrived here as copied source rather than an installed
package, so upstream fixes reach the blog only when someone brings them
across. Upstream documents the same approach in [How to update
dependencies of
AstroPaper](https://astro-paper.pages.dev/posts/how-to-update-dependencies/),
and warns that merging a customised template means resolving conflicts by
hand. This blog has customised a lot of it.

## Before you start

- Comfort resolving git merge conflicts across a few dozen files.
- Knowing which paths belong to the theme and which are this blog's,
  listed under AstroPaper upstream in `CLAUDE.md`.
- A remote lives in this clone's git configuration, so it does not travel
  with the repository. Every fresh clone adds it once, including a Claude
  Code session on the web.

## Add the upstream remote

```bash
git remote add --no-tags astro-paper https://github.com/satnaing/astro-paper.git
git fetch astro-paper
```

Upstream tags every release, `v1.0.0` onward. Those tags would land
beside this repository's own `1.0.x` release tags, and a later
`git push --tags` would publish them here. The cycle below tracks
`astro-paper/main`, so `--no-tags` costs nothing.

## Find what upstream changed

Merging is what establishes the baseline for this step. A merge joins the
two histories, which makes the upstream commit it brought in an ancestor
of `HEAD`. Git then answers "what did this blog reconcile last time" on
its own:

```bash
git fetch astro-paper
git log --oneline "$(git merge-base HEAD astro-paper/main)..astro-paper/main"
```

Every commit listed is a change this blog has not adopted. Read that
list rather than a file diff. The commit subjects say what each change is
for. A diff of the theme paths instead mixes those changes together with
this blog's chosen divergence, and nothing in it separates the two.

Before the first merge the command fails with `no merge base`, because
the scaffold copied the theme files without their history.

To see the diff for one commit that looks worth taking:

```bash
git show <sha> -- src/components src/layouts src/pages src/styles src/utils src/content.config.ts
```

## Merge the changes

Run the merge from a branch, so an unworkable result is a discarded
branch rather than a damaged `main`:

```bash
git merge astro-paper/main
```

The first merge needs `git pull astro-paper main --allow-unrelated-histories`
instead, and is large enough to be its own piece of work. This
repository's copy sits at a v4-era snapshot while upstream is v6, which
makes the first merge a migration rather than a sync.

Resolve in this blog's favour wherever the two disagree on something
chosen on purpose. Three of those are worth naming:

- The post collection is named `blog` and loads from `src/data/blog/`.
  Upstream renamed it to `posts` under `src/content/posts/`, so adopting
  that rename moves every post and touches every `getCollection` call.
- The loader glob in `src/content.config.ts` accepts `.md` alone, where
  upstream accepts `.md` and `.mdx`. Restoring MDX degrades in silence:
  `src/pages/rss.xml.ts` and `src/pages/posts/[...slug]/index.md.ts`
  both read `post.body` as raw Markdown, and the build still passes.
- The theme's sample posts are gone by choice. A merge brings them back
  as new files rather than as conflicts.

Merging rather than applying a change by hand is what keeps the baseline
accurate. A hand-applied change leaves the histories where they were, so
the next review offers the same commits again.

## Verify

```bash
pnpm build
```

That runs `astro check` and Pagefind alongside the build. Then confirm
the parts a passing build leaves untested:

1. Existing post links still resolve.
2. A post dated in the future produces no `dist/posts/<slug>/`.
3. Tag pages and search still list the posts they did before.

The merge commit records what this blog adopted. Nothing else needs
updating to mark it.
