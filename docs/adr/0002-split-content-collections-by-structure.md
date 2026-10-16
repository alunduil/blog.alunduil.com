# 2. Split content collections by structure

## Status

Accepted

## Context

The blog's posts fall into a handful of types, and the source tree sorted
them along two unrelated axes. `src/content/posts/reviews/` grouped by type
and put the folder in the URL (`/posts/reviews/<slug>/`). `_nikola/` and
`_hakyll/` grouped by the engine an archival post came from, and the
underscore kept them out of the URL. Every other post sat at the top level.
Moving a file between folders changed its published URL, so the layout
froze in place. Folders carried no meaning beyond the URL, for the author or
for Astro.

Astro's [content collections guide][collections] scopes a collection to
content that shares a structure: "a directory of blog posts written in
Markdown which all have the same frontmatter properties." The `pages`
collection already follows that rule: `about.md` has no publication date or
tags and never enters a feed or listing. Here, a type's *structure* is
three things: its frontmatter, how its pages present, and which feed
carries it.

The 27 posts fall into five types:

| Type | Posts | What it is |
| --- | --- | --- |
| `review` | 11 | A claim about an outside work: a book, game, or paper. |
| `story` | 7 | Lived experience told in scenes, built to a change. |
| `how-to` | 5 | Reproducible steps, mostly archival. |
| `practice` | 4 | A personal system, revisited years later: the "How I X" series. |
| `note` | 0 | Short enough to syndicate whole; none written yet. |

Reviews differ from the rest in all three parts of structure:

- They name the work under review and carry its cover art, the only posts
  with a representative image.
- They read and present differently, and the cover belongs in their
  listing.
- They want their own section and feed, apart from the main stream.

### Considered options

- **Type as a frontmatter field, folders unchanged.** No URL moves, but
  reviews stay in the main listing and feed, and their extra fields become
  conditional on the type.
- **One folder per type.** Sorts the source by type. Either every URL moves,
  or underscored folders keep the URLs and the type lives in two places.
- **One collection per structure.** Types that share a structure share a
  collection; a type whose structure diverges gets its own.

## Decision

We will split content into Astro collections by structure. When a type's
structure diverges from `posts`, we extract it into its own collection and
redirect every URL the move changes. Routing that crosses types, such as
picking which posts syndicate to a given platform, is a frontmatter flag on
the entry, not a type or a collection.

Applied to the current corpus:

- `posts` holds `story`, `practice`, and `how-to`, typed by a frontmatter
  field. `_nikola/` and `_hakyll/` stay inside it as provenance; the
  remaining posts stay where they are.
- `reviews` becomes a collection in `src/content/reviews/`, with its own
  schema, layout, listing at `/reviews/`, and feed at `/reviews.xml`.
  Reviews leave `/posts` and `rss.xml`.
- Each review's old URL, `/posts/reviews/<slug>/`, redirects to
  `/reviews/<slug>/`.
- `note` joins neither list yet. Its format decides whether it is a
  `posts` type or a collection of its own.

## Consequences

- Each collection's schema can require what its type needs, so a review
  missing its cover fails the build.
- Sections, listings, and feeds follow collections directly, with no
  filtering on a type field.
- Pages that mix types must merge collections, which touches theme files
  and adds work to every upstream merge.
- Feed subscribers stop seeing reviews in `rss.xml` unless they also
  subscribe to `reviews.xml`, and the syndication service needs a second
  route.
- Redirects accumulate: each extraction leaves a permanent set behind.

[collections]: https://docs.astro.build/en/guides/content-collections/
