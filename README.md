# blog.alunduil.com

Personal blog. Built with [Astro] and the [AstroPaper] theme. Deployed to
GitHub Pages on push to `main`.

## Local development

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # produces ./dist
```

## Content

Posts follow the [IndieWeb] post-type vocabulary: `article` and `note`
as types, with an open style axis (narrative, experience report, review)
inside `article`. See [ADR 0002](docs/adr/0002-adopt-indieweb-post-types-as-the-content-vocabulary.md)
for the decision and [post frontmatter](docs/reference/post-frontmatter.md)
for the fields and scheduling.

## Theme

Theme is [AstroPaper] by Sat Naing, MIT-licensed. See [`LICENSE`](LICENSE).

[Astro]: https://astro.build/
[IndieWeb]: https://indieweb.org/posts
[AstroPaper]: https://github.com/satnaing/astro-paper
