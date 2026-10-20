# Post frontmatter and scheduling

The frontmatter fields, scheduling rules, and file locations of a blog
post. The schema is `src/content.config.ts`; this page adds the
conventions layered on it. For markup inside the post body, see
[post body markup](post-body.md).

## Fields

Fields, in schema order:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `author` | no | string | Defaults to `site.author` in `astro-paper.config.ts`. |
| `pubDatetime` | yes | date | Publication moment; gates visibility (see [Scheduling](#scheduling)). |
| `modDatetime` | no | date \| null | Last substantive edit. |
| `title` | yes | string | Post title. |
| `type` | yes | `story` \| `practice` \| `how-to` | The kind of post (see [Types](#types)). |
| `series` | no | `how-i` | The series the post belongs to (see [Series](#series)). |
| `featured` | no | boolean | Pins the post to the home page's featured list. |
| `draft` | no | boolean | Unused; publication gates on `pubDatetime`, not this flag. |
| `tags` | no | string[] | Content topics; defaults to `["others"]` (see [Tags](#tags)). |
| `ogImage` | no | image \| string | Overrides the dynamic OG card; required on reviews (see [Reviews](#reviews)). |
| `description` | yes | string | ~120–150 chars; becomes `og:description` and the dlvr.it syndication text. |
| `canonicalURL` | no | string | The canonical URL when the post is canonical off-site. |
| `hideEditPost` | no | boolean | Hides the "edit this page" link. |
| `timezone` | no | string | IANA zone for `pubDatetime`/`modDatetime`; defaults to `site.timezone` in `astro-paper.config.ts`. |
| `linkedin` | no | boolean | Syndicates the post to LinkedIn (see [LinkedIn](#linkedin)). |

`pubDatetime` and `modDatetime` are live-site moments, independent of
branch commit time.

`modDatetime` replaces `pubDatetime` in the byline under an "Updated"
label and appears in the page metadata. Listings and the RSS feed order
and date posts on `pubDatetime`, so an edit leaves a post in place and
doesn't mark it unread in feed readers.

## Types

Every post sets one of three types. A missing or unknown value fails the
build.

| Type | What it is |
| --- | --- |
| `story` | Lived experience told in scenes, built to a change. |
| `practice` | A personal system, revisited years later: the "How I X" series. |
| `how-to` | Reproducible steps. |

A how-to's JSON-LD declares `TechArticle` alongside `BlogPosting`.

Reviews and notes are collections of their own and set no `type`.

Listing rows show each post's type, and `review` or `note` for the
other collections.

## Series

`series: how-i` puts a post in the "How I X" series. Set it on every
entry; an unknown value fails the build.

`/series/how-i/` lists the entries oldest first. Each entry shows its
position in the series under the date, linked to that page.

Add a series by extending `seriesSchema` and `seriesInfo` in
`src/utils/series.ts`.

## Scheduling

`pubDatetime` is 08:00 in the post's `timezone` (`Europe/London`
currently, so 08:00 British Summer Time is `07:00:00Z`). The weekday
encodes content type:

| Weekday | Content |
| --- | --- |
| Tuesday | Tech / methodology |
| Sunday | Personal / reflective, including reviews |

Monday and Friday are unused. Each `pubDatetime` is unique; a collision
or a slipped slot moves to the next open date on the same weekday.

The `post-scheduling` hook in `pre-commit` checks both halves—uniqueness,
and the weekday read in the post's own `timezone`. Nothing checks that a
Tuesday post is tech and a Sunday post personal. No frontmatter field
states a post's subject.

A future `pubDatetime` gates publication: AstroPaper's
`posts.scheduledPostMargin` (~15 minutes) hides the post until the date
passes. Publication is independent of the merge; the date is the trigger.
No post sets `draft: true`.

## Locations

The posts collection loads `**/[^_]*.{md,mdx}` under `src/content/posts`,
and the reviews collection the same pattern under `src/content/reviews`,
both skipping `_`-prefixed files. An `.mdx` entry fails the build: the RSS
feeds and each entry's `index.md` serve the body as Markdown and can't
render MDX yet.

| Content | Path | URL |
| --- | --- | --- |
| Post | `src/content/posts/<slug>.md` | `/posts/<slug>/` |
| Review | `src/content/reviews/<slug>.md` | `/reviews/<slug>/` |
| Archival republish | `src/content/posts/_<engine>/<slug>.md` | `/posts/<slug>/` |
| Note | `src/content/notes/<slug>.md` | `/notes/<slug>/` |

Non-`_` folders stay in the URL; `_`-prefixed folders (`_hakyll/`) are
stripped, so archival posts serve at `/posts/<slug>/`.

Draft outlines live in `outlines/<slug>.md`: tracked, outside `src/`,
unpublished, and excluded from the linters. Public in the repository.

## Reviews

Reviews are their own collection. They list at `/reviews/` and feed at
`/reviews/rss.xml`, and stay out of `/posts/` and the posts feed. The home
page, archives, and tags interlace them with posts by date.

The review schema extends the post fields with two requirements, so a
review missing either fails the build:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `reviewed` | yes | string | The name of the work under review. |
| `ogImage` | yes | image | The reviewed work's cover, in place of the dynamic OG card. |

The cover is `src/assets/images/<slug>-cover.jpg`, referenced with two
`../`:

```yaml
ogImage: ../../assets/images/<slug>-cover.jpg
```

## Archival republishes

Restored posts live under `src/content/posts/_<engine>/` (`_hakyll/`,
`_nikola/`). They set `hideEditPost: true`, set `timezone` to the zone of
original authorship, and open with the stanza:

```markdown
> **Archival republish.** From this blog's <engine> era; lightly copyedited.
```

`<engine>` names the source ("Hakyll" for `_hakyll/`).

## Notes

A note is short enough to post whole to Bluesky: at most 300 characters
of plain text, enforced by `scripts/check-note-length.ts`. It responds
to at most one source: a quote with commentary, or a thought standing
alone. Notes are a collection of their own, listed at
`/notes/` with their feed at `/notes/rss.xml`, and stay out of `rss.xml`.
Home, archives, tag pages, and `llms.txt` list them by date among posts
and reviews. The schema is `noteSchema` in `src/utils/notes.ts`.

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `pubDatetime` | yes | date | Publication moment; gates visibility as for posts. |
| `title` | without `source` | string | Page title; overrides the generated one. |
| `source.url` | with `source` | URL | The work the note responds to. |
| `source.title` | with `source` | string | Its title. |
| `source.author` | no | string | Its author. |
| `tags` | no | string[] | Content topics; defaults to none. |
| `timezone` | no | string | IANA zone for `pubDatetime`. |

A note with a source and no `title` gets the title `On <author>'s
"<title>"`, or `On "<title>"` without an author. Set `title` on any note
whose generated title reads badly. A note with neither fails the build.

The title appears in the browser tab, the feed item, the archives, and
`llms.txt`. The note's page and its card on home, tag pages, and
`/notes/` show it only to screen readers, so keep anything readers need
in the body.

The body is the note. Put the quoted line in a `>` quote. The page and
the feed item end with the source line, so the body needn't link the
source. The body also becomes `og:description`.

`scripts/check-post-scheduling.ts` doesn't check notes.

## LinkedIn

`linkedin: true` adds a post to `/linkedin.xml`, the feed syndicated to
LinkedIn. Every post, marked or not, syndicates to the other socials from
`rss.xml`. Reviews and notes can't be marked.

Mark a post when an engineer in the author's field would forward it to a
colleague at another company: lessons learned, postmortems, tooling
deep-dives, and engineering methodology. Personal essays, hobby projects,
and practices not yet tried stay off.

## Tags

Tags name what a post is about—content topics. Archive, era, format,
and draft-state belong to directory structure or schema fields, not tags.
The soft cap is ~3.
