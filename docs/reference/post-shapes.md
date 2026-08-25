# Post shapes

Every post sets `shape`, which says how it is written. The field drives two
things: which drafting skill applies, and the schema.org type the page
declares to machines. For the other frontmatter fields see
[post frontmatter](post-frontmatter.md).

## The shapes

| Shape | What it is | Drafting |
| --- | --- | --- |
| `essay` | Argues a claim out of lived experience. | `outline-draft` → `post-draft` |
| `practice` | A personal system, described and revisited years later. | — |
| `review` | Argues a claim about an outside work. | `review-draft` |
| `how-to` | Reproducible steps. | — |
| `note` | Short enough to syndicate whole. | — |

The names descend from Werlich's text typology (1976), which sorts writing
by the act it performs: argumentative, expository, instructive, narrative,
descriptive. `essay` and `review` are argumentative, `practice` expository,
`how-to` instructive.

`shape` defaults to `essay`. Each published post sets it explicitly anyway,
so the default only catches a new post that forgets.

Two shapes have no drafting skill yet, and `how-to` is mostly archival:
current-era instructions belong in `docs/how-to/`, not on the blog.

## Shape is not the directory

Directory layout is independent of shape and stays as it is. `getPath` keeps
every non-underscore path segment in the URL, so moving a published post into
a shape-named folder would change its URL and break every link to it.

`src/data/blog/reviews/` predates the field and still serves
`/posts/reviews/<slug>/`. It stays for the URLs it already owns, and the
cover-image path depends on the extra depth. Where the two disagree, `shape`
is the one that decides anything.

## What machines see

`src/utils/getSchemaType.ts` maps the shape to the `@type` in each post's
JSON-LD.

| Shape | schema.org type |
| --- | --- |
| `essay`, `practice`, `note` | `BlogPosting` |
| `how-to` | `TechArticle` |
| `review` | `Review` |

`TechArticle` carries the how-tos rather than `HowTo`, which expects
machine-readable `step` values this blog's prose doesn't supply.

A `review` also sets `reviewed` to the name of the work, which becomes
`itemReviewed` in the JSON-LD:

```yaml
shape: review
reviewed: "Tales from Earthsea"
```

Only posts emit JSON-LD. Listing and utility pages don't describe themselves
as creative works.
