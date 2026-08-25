# 2. Adopt IndieWeb post types as the content vocabulary

## Status

Accepted

## Context

This blog follows [POSSE]: the copy here is canonical, and each
syndicated copy links back to it. That commits the blog to IndieWeb
practice, though not yet to IndieWeb's names for things. The corpus
picks up nouns one at a time—post, story, tech, review—and they answer
two different questions. "Review" says what kind of thing a post is.
"Story" says how the post reads. Nothing marks which question a given
noun answers.

Short-form posts force the distinction into the open. A two-sentence
thought and a two-thousand-word argument syndicate differently: the
short one carries its whole body onto a character-limited network,
while the long one carries a title, a hook, and a link. The two differ
in kind, and the current vocabulary has no word for that difference.

[Post Type Discovery] already names it. The specification defines
note, article, reply, repost, like, photo, and RSVP, with bookmark and
quotation among the exploratory types, and IndieWeb readers and feed
tooling speak that vocabulary. Its primary split for text posts is
title presence: a title makes an article, and its absence makes a
note.

That split does not survive contact with the site. AstroPaper's blog
collection requires `title` on every entry
(`src/content.config.ts`), so every post here has one and nothing can
be inferred from it.

"Story" and "tech" are absent from the specification, and rightly so.
They describe register—how a post reads—which the specification leaves
to the publisher. Two posts can both be articles and share nothing in
how they read.

Settling the vocabulary now costs less than settling it later. A
schema marker for notes, a syndication feed that carries full bodies,
and the drafting skills each encode these names; renaming after they
ship costs a migration apiece.

## Decision

Adopt the IndieWeb post types as this blog's content vocabulary, split
across two axes.

**Type** says what a post is, and takes its name from [Post Type
Discovery]. Two types are in use:

- `article`—long-form and titled. Syndicates as title, hook, and link.
- `note`—short-form. Syndicates as its full body.

The blog adopts further types (`quotation`, `bookmark`, `reply`,
`repost`, `like`) as posts call for them, under their specification
names rather than local coinages.

**Style** says how an article reads, and this blog owns it. Style
applies inside `article` only, and a style never names a type.
Narrative, experience report, and review are the styles in use. The
list stays open: a new way of writing an article adds a style and
needs no revision here.

Type is a signal the blog carries explicitly, not one derived from the
title. AstroPaper requires a title, so a note holds a page title and
remains a note.

Every post published to date is an article. No notes exist yet.

## Consequences

- Schema, feeds, drafting skills, and prose draw on one set of names,
  and a reader who knows IndieWeb already knows most of it.
- The style axis absorbs shifts in register without disturbing types.
  A new way of writing is a style; only a new kind of thing is a type.
- Notes need an explicit marker in the schema, because the
  specification's title test cannot classify posts here. This decision
  creates the need for that machinery.
- Naming is constrained from here on. A future post type takes its
  specification name even where a local noun reads better.
- Prose written before this decision still says "story post" where it
  now means a narrative article. Those names change as the surfaces
  around them get worked, rather than in one sweep.
- Reversible on paper and expensive in practice: once a schema field,
  a feed, and skill names carry these terms, changing them becomes a
  migration.

[POSSE]: https://indieweb.org/POSSE
[Post Type Discovery]: https://ptd.spec.indieweb.org/
