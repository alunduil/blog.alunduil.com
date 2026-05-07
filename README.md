# blog.alunduil.com

Personal blog. Built with [Astro] and the [AstroPaper] theme. Deployed to
GitHub Pages on push to `main`.

## Local development

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # produces ./dist
```

## Posting flow

1. Add a markdown file under `src/data/blog/`. AstroPaper's frontmatter
   reference is in [`adding-new-post.md`](src/data/blog/adding-new-post.md).
2. While drafting, set `draft: true` in frontmatter—drafts are excluded
   from the build.
3. Flip `draft: false` (or remove it) and merge to `main`. CI builds and
   publishes.

## Theme

Theme is [AstroPaper] by Sat Naing, MIT-licensed. See [`LICENSE`](LICENSE).

[Astro]: https://astro.build/
[AstroPaper]: https://github.com/satnaing/astro-paper
