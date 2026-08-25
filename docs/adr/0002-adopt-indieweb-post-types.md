# 2. Adopt IndieWeb post types as the content vocabulary

## Status

Accepted

## Context

The corpus names its own content with nouns picked one at a time: post,
story, tech, review. They answer two different questions. "Review" says
what kind of thing a post is; "story" says how the post reads. Nothing
marks which question a given noun answers.

Length changes how a post syndicates. A two-sentence thought carries
its whole body onto a character-limited network. A two-thousand-word
argument carries a title, a hook, and a link. The corpus has no noun
for that difference.

[Post Type Discovery] already names it. The specification defines note,
article, reply, repost, like, photo, and RSVP, with bookmark and
quotation among the exploratory types. This blog follows [POSSE], so
those are the names its readers and feeds already speak. The
specification's primary split for text posts is title presence: a title
makes an article, its absence a note.

Title presence cannot do that work here. AstroPaper's blog collection
requires `title` on every entry (`src/content.config.ts`), so every
post carries one and the test separates nothing.

Neither "story" nor "tech" appears in the specification. Both describe
register, which it leaves to the publisher. Two posts can both be
articles and share nothing in how they read.

Settling the vocabulary now costs less than settling it later. A schema
marker for notes, a syndication feed carrying full bodies, and the
drafting skills each encode these names, and renaming after they ship
costs a migration apiece.

## Decision

Adopt the IndieWeb post types as this blog's content vocabulary, split
across two axes.

**Type** says what a post is, and takes its name from [Post Type
Discovery]. Two types are in use:

- `article`—long-form and titled. Syndicates as title, hook, and link.
- `note`—short-form. Syndicates as its full body.

Mark type explicitly rather than deriving it from title presence. A
note holds a page title and stays a note.

Further types—`quotation`, `bookmark`, `reply`, `repost`, `like`—arrive
under their specification names when a post calls for one.

**Style** says how an article reads, and this blog owns it. Style
applies inside `article` only, and a style never names a type.
Narrative, experience report, and review are the styles in use. The
list stays open, and adding one needs no revision here.

## Consequences

- Schema, feeds, drafting skills, and prose draw on one set of names,
  and a reader who knows IndieWeb already knows most of them.
- The style axis absorbs shifts in register without disturbing types.
- Notes need an explicit marker in the schema, because title presence
  classifies nothing here.
- A future post type takes its specification name even where a local
  noun reads better.
- Reversible on paper and expensive in practice: a schema field, a
  feed, and skill names all come to carry these terms.

[POSSE]: https://indieweb.org/POSSE
[Post Type Discovery]: https://ptd.spec.indieweb.org/
