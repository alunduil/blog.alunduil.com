---
name: syndicate
description: Turn one published blog post into crafted, platform-native drafts for Bluesky, Threads, Instagram, and Facebook. The blog is the canonical thought; each surface gets a derivative that reads native and points back. Generation is automated; posting stays manual — drafts land in chat, nothing is committed. Use via `/syndicate [path|slug|url]`, defaulting to the most recently published post. Use when syndicating a post, drafting social copy for an article, or doing the per-post IG/FB/Bluesky/Threads pass.
---

# Syndicate

One canonical post → crafted per-surface drafts for Bluesky, Threads,
Instagram, Facebook. The blog holds the canonical thought; each surface gets a
derivative that earns its place natively and links back — never a raw repost.

**Generation is automated; posting stays manual.** Drafts land in chat, the
author posts them by hand. Nothing is committed — the drafts are ephemeral
(per the ephemeral-venue rule). Auto-posting the friendly APIs (Bluesky,
Threads) is a deliberate *later* add-on, out of scope here.

Invoke: `/syndicate [path|slug|url]` — defaults to the most recently published
post under `src/data/blog/`.

## 1. Resolve the post

Accept a file path, slug, or live URL. Default: the newest post by
`pubDatetime` under `src/data/blog/` (skip `examples/`, `_releases/`, and
upstream tutorials; a future `pubDatetime` is fine — syndication can be drafted
ahead of publication). Read frontmatter (`title`, `description`, `slug`,
`pubDatetime`, `tags`) and the body.

Derive:

- **Canonical URL** — `SITE.website` + `posts/<slug>/` (e.g.
  `https://blog.alunduil.com/posts/<slug>/`).
- **OG card** — `.../posts/<slug>/index.png` (`dynamicOgImage: true`). This is
  the zero-effort image for the image-bearing surfaces.

## 2. Extract the kernel

One sentence: what the post actually argues — its hook, not its summary. Plus
2–3 *concrete, specific* details from the body (a number, a swap, a failure)
that stop a scroll. Pull from the body, not the `description`; the description
is written for search, the social hook for a feed.

## 3. Draft per surface

The per-surface constraints below are the "crafted" knowledge — what keeps
these from looking like spam. Char limits are current convention; calibrate on
use.

### Bluesky (`@alunduil.bsky.social`)

- ≤300 graphemes. Links unfurl to a card — include the canonical URL on its
  own last line.
- Lead with the hook sentence. 0–1 hashtags (Bluesky culture is hashtag-light).

### Threads

- ≤500 chars. Threads soft-deprioritises external links, so the hook and its
  payoff must stand alone; put the link last as `Full post: <url>`.
- At most one topic tag.

### Instagram (image-first, link-hostile)

- Caption: scroll-stopper first line, then 2–4 lines of value, then
  `Link in bio.` No clickable links in captions.
- Bio link points to the blog home (or swap to the latest post around launch).
- Image: default to the post's OG card. Flag when the post deserves a bespoke
  image or carousel, and sketch the carousel beats (one idea per card).
- Hashtags: 3–8 niche/topical tags — reuse the post's `tags` plus adjacent
  ones, not generic mega-tags.

### Facebook

- Native hook in the post body — never lead with the bare link.
- Paste the URL so the preview unfurls; once it renders, the raw URL line may
  be deleted. Verify the preview's title/description/image before posting.
- Image optional; the OG card is the default preview image.

## 4. Present

All four drafts in chat, labelled per surface, copy-paste ready. Note the image
source for IG/FB. Write nothing to the repo.

## Notes

- **Voice.** Match the post's own register — conversational, first-person, no
  marketing-speak. The external-repo voice rules don't apply here; this is
  alunduil's own surface.
- **Canonical-first.** Every surface links back to the blog; a derivative never
  replaces the post.
- **Trigger.** Manual invocation. `/digest` can later surface recently
  published posts not yet syndicated — not wired in yet.
