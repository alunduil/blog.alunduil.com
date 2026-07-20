# Post frontmatter and scheduling

Reference for the frontmatter fields, scheduling rules, and file
locations of a blog post. The schema lives in
`src/content.config.ts`; this page documents the fields and the
conventions layered on top of them.

## Fields

Each post opens with a YAML frontmatter block. Fields, in schema order:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `author` | no | string | Defaults to `SITE.author`; set only to override. |
| `pubDatetime` | yes | date | Publication moment. Gates visibility (see [Scheduling](#scheduling)). |
| `modDatetime` | no | date \| null | Last substantive edit. A live-site moment, not a branch commit. |
| `title` | yes | string | Post title. |
| `featured` | no | boolean | Pins the post to the home page's featured list. |
| `draft` | no | boolean | **Never set.** A future date gates publication, not this flag (see [Scheduling](#scheduling)). |
| `tags` | no | string[] | Content topics; defaults to `["others"]`. See [Tags](#tags). |
| `ogImage` | no | image \| string | Overrides the dynamic OG card. Set for reviews (see [Locations](#locations-and-urls)). |
| `description` | yes | string | ~120–150 chars. Becomes `og:description` and the dlvr.it syndication text; state the thesis plainly. |
| `canonicalURL` | no | string | Points elsewhere when the post is canonical off-site. |
| `hideEditPost` | no | boolean | Hides the "edit this page" link. Set for archival or immutable content. |
| `timezone` | no | string | IANA zone for interpreting `pubDatetime`/`modDatetime`; defaults to `SITE.timezone`. |

`pubDatetime` and `modDatetime` are live-site moments. Don't pin them to
a local-branch commit time; a future `pubDatetime` doubles as the
publication gate and a placeholder.

## Scheduling

`pubDatetime` is **08:00 local**, where "local" is the post's
`timezone` (`Europe/London` currently, so 08:00 British Summer Time
serialises as `07:00:00Z`). The weekday carries content type:

- **Tuesday**—tech / methodology.
- **Sunday**—personal / reflective (reviews included).
- Skip Monday and Friday unless there's a specific reason.

No two posts share a `pubDatetime`. When a date collides or a post slips
its slot, move it to the next open date **on its own weekday**—not the
next calendar day.

A future `pubDatetime` gates publication entirely: it keeps the post
hidden via AstroPaper's `SITE.scheduledPostMargin` (~15 minutes), so the
date is the real publish target. Merging a post's PR accepts the
editorial work; the future date defers publication. Nothing sets
`draft: true`.

## Locations and URLs

The blog collection loads `**/[^_]*.md` under `src/data/blog`; the build
skips files and directories prefixed with `_`.

| Content | Path | Served at |
| --- | --- | --- |
| New post | `src/data/blog/<slug>.md` | `/posts/<slug>/` |
| Review | `src/data/blog/reviews/<slug>.md` | `/posts/reviews/<slug>/` |
| Archival republish | `src/data/blog/_<engine>/<slug>.md` | `/posts/<slug>/` |

The theme keeps non-`_` folders (like `reviews/`) in the URL path and
strips `_`-prefixed folders (`_hakyll/`, `_releases/`), so archival posts
still serve at `/posts/<slug>/`.

Reviews carry the reviewed work's cover as `ogImage`, the one post type
that overrides the dynamic OG card. The cover file goes in
`src/assets/images/<slug>-cover.jpg`, referenced with three `../` from
the deeper `reviews/` folder:

```yaml
ogImage: ../../../assets/images/<slug>-cover.jpg
```

## Archival republishes

Restored posts live under `src/data/blog/_<engine>/` (the engine of
origin: `_hakyll/`, `_nikola/`). They set `hideEditPost: true`, carry a
`timezone` matching the zone of authorship, and open with the stock
stanza before the body:

```markdown
> **Archival republish.** From this blog's <engine> era; lightly copyedited.
```

`<engine>` matches the source directory ("Hakyll" for `_hakyll/`).

## Tags

Tags answer "what is this post *about*?"—content topics only. Archive,
era, format, and draft-state signals live in directory structure or
schema fields, never in tags. Soft cap of ~3; drop a marginal tag rather
than padding.

## Drafting artefacts

Story and review drafts iterate in `outlines/<slug>.md` before the post
exists. The `outlines/` directory is tracked but sits outside `src/`, so
it stays unpublished and out of the prose linters and link checker. It's
public in the repository.
