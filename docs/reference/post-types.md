# Post types and styles

What a post *is* (its type) and how it *reads* (its style). The
reasoning behind the vocabulary is in
[ADR 0002](../adr/0002-adopt-indieweb-post-types.md). For the
frontmatter fields and scheduling, see
[post frontmatter](post-frontmatter.md); for markup inside the body, see
[post body markup](post-body.md).

## Type

Type says what a post is. The names come from [Post Type Discovery], so
they carry the same meaning here as anywhere else on the IndieWeb.

| Type | Length | Syndicates as |
| --- | --- | --- |
| `article` | long-form | title, hook, and link |
| `note` | short-form | full body |

Type is marked, never inferred from the title. AstroPaper requires
`title` on every entry in the blog collection
(`src/content.config.ts`), so a note holds a page title and stays a
note.

Nothing in the schema carries the marker yet, and every post published
to date is an article.

A post that needs `quotation`, `bookmark`, `reply`, `repost`, or `like`
takes that specification name rather than a local coinage.

## Style

Style says how an article reads. The specification does not cover
register, so these names are the blog's own, and the list stays open.

| Style | Shape | Pipeline |
| --- | --- | --- |
| narrative | scenes building to a change | `outline-draft` → `post-draft` |
| experience report | what shipped, and what it taught | none |
| review | a claim and its evidence | `review-draft` |

A style applies inside `article` only, and never names a type.

[Post Type Discovery]: https://ptd.spec.indieweb.org/
