# Post types and styles

What a post *is* and how it *reads*, on two independent axes. This page
is the current vocabulary; the reasoning behind it is in
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

The blog carries type as an explicit signal. AstroPaper requires
`title` on every entry in the blog collection
(`src/content.config.ts`), so the specification's title-presence test
cannot classify posts here: a note holds a page title and stays a note.

A post that needs `quotation`, `bookmark`, `reply`, `repost`, or `like`
takes that specification name rather than a local coinage.

Everything published to date is an article.

## Style

Style says how an article reads, and this blog owns the axis. The list
stays open—a new way of writing an article adds a style.

| Style | Shape | Pipeline |
| --- | --- | --- |
| narrative | scenes building to a change | `outline-draft` → `post-draft` |
| experience report | what shipped, and what it taught | none yet |
| review | a claim and its evidence | `review-draft` |

A style applies inside `article` only, and never names a type.

[Post Type Discovery]: https://ptd.spec.indieweb.org/
