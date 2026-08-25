# Post frontmatter and scheduling

The frontmatter fields, scheduling rules, and file locations of a blog
post. The schema is `src/content.config.ts`; this page adds the
conventions layered on it. For markup inside the post body, see
[post body markup](post-body.md).

## Fields

Fields, in schema order:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `author` | no | string | Defaults to `SITE.author`. |
| `pubDatetime` | yes | date | Publication moment; gates visibility (see [Scheduling](#scheduling)). |
| `modDatetime` | no | date \| null | Last substantive edit. |
| `title` | yes | string | Post title. |
| `featured` | no | boolean | Pins the post to the home page's featured list. |
| `draft` | no | boolean | Unused; publication gates on `pubDatetime`, not this flag. |
| `tags` | no | string[] | Content topics; defaults to `["others"]` (see [Tags](#tags)). |
| `shape` | no | string | One of `essay`, `practice`, `review`, `how-to`, `note`; defaults to `essay` (see [post shapes](post-shapes.md)). |
| `reviewed` | no | string | Name of the work a `review` is about; becomes `itemReviewed`. |
| `ogImage` | no | image \| string | Overrides the dynamic OG card; reviews set it (see [Locations](#locations)). |
| `description` | yes | string | ~120–150 chars; becomes `og:description` and the dlvr.it syndication text. |
| `canonicalURL` | no | string | The canonical URL when the post is canonical off-site. |
| `hideEditPost` | no | boolean | Hides the "edit this page" link. |
| `timezone` | no | string | IANA zone for `pubDatetime`/`modDatetime`; defaults to `SITE.timezone`. |

`pubDatetime` and `modDatetime` are live-site moments, independent of
branch commit time.

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

A future `pubDatetime` gates publication: AstroPaper's
`SITE.scheduledPostMargin` (~15 minutes) hides the post until the date
passes. Publication is independent of the merge; the date is the trigger.
No post sets `draft: true`.

## Locations

The blog collection loads `**/[^_]*.md` under `src/data/blog`, skipping
`_`-prefixed files and directories.

| Content | Path | URL |
| --- | --- | --- |
| Post | `src/data/blog/<slug>.md` | `/posts/<slug>/` |
| Review | `src/data/blog/reviews/<slug>.md` | `/posts/reviews/<slug>/` |
| Archival republish | `src/data/blog/_<engine>/<slug>.md` | `/posts/<slug>/` |

Non-`_` folders (`reviews/`) stay in the URL; `_`-prefixed folders
(`_hakyll/`) are stripped, so archival posts serve at `/posts/<slug>/`.

Draft outlines live in `outlines/<slug>.md`: tracked, outside `src/`,
unpublished, and excluded from the linters. Public in the repository.

Reviews set `ogImage` to the reviewed work's cover, the only post type
that overrides the dynamic OG card. The file is
`src/assets/images/<slug>-cover.jpg`, referenced from the deeper
`reviews/` folder with three `../`:

```yaml
ogImage: ../../../assets/images/<slug>-cover.jpg
```

## Archival republishes

Restored posts live under `src/data/blog/_<engine>/` (`_hakyll/`,
`_nikola/`). They set `hideEditPost: true`, set `timezone` to the zone of
original authorship, and open with the stanza:

```markdown
> **Archival republish.** From this blog's <engine> era; lightly copyedited.
```

`<engine>` names the source ("Hakyll" for `_hakyll/`).

## Tags

Tags name what a post is about—content topics. Archive, era, format,
and draft-state belong to directory structure or schema fields, not tags.
The soft cap is ~3.
