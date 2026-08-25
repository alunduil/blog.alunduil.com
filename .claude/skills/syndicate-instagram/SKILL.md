---
name: syndicate-instagram
description: Craft an Instagram post from a published blog post—image or carousel guidance, a scroll-stopping caption, link-in-bio handling, and a hashtag set. Instagram is the one surface the blog syndicates by hand; Bluesky, Threads, Facebook, and LinkedIn auto-syndicate through dlvr.it (ADR 0001). Generation is automated, posting manual—the draft lands in chat, nothing is committed. Use via `/syndicate-instagram [path|slug|url]`, defaulting to the most recently published post. Use when drafting an Instagram post for an article or doing the per-post Instagram pass.
---

# Syndicate to Instagram

The blog auto-syndicates to Bluesky, Threads, Facebook, and LinkedIn through
dlvr.it—RSS feed in, uniform hook out, no manual step
(`docs/adr/0001-use-dlvrit-for-social-syndication.md`). Instagram is the
deliberate exception: image-first and link-hostile, it's the surface where the
uniform feed hook fits worst, so it's crafted by hand here.

The blog stays canonical; the Instagram post is a derivative that points back.
**Generation is automated; posting stays manual**—the draft lands in chat,
nothing is committed.

Invoke: `/syndicate-instagram [path|slug|url]`—defaults to the newest post
under `src/data/blog/`.

Pipeline: **resolve → extract kernel → draft → present.**

## 1. Resolve the post

Accept a file path, slug, or live URL. Default: the newest post by
`pubDatetime` under `src/data/blog/` (a future `pubDatetime` is
fine—Instagram can be drafted ahead of publication). Read frontmatter
(`title`, `description`, `slug`, `pubDatetime`, `tags`) and the body.

Derive:

- **Canonical URL**— `SITE.website` + `posts/<slug>/`.
- **OG card**— `.../posts/<slug>/index.png` (`dynamicOgImage: true`), the
  zero-effort default image.

## 2. Extract the kernel

One sentence: what the post actually argues—its hook, not its summary. Plus
2–3 *concrete, specific* details from the body (a number, a swap, a failure)
that stop a scroll. Pull from the body: the `description` is the feed hook
dlvr.it already posts elsewhere, so Instagram earns something richer.

## 3. Draft the post

- **Caption**: scroll-stopper first line, then 2–4 lines of value, then
  `Link in bio.`—Instagram captions render links as plain text.
- **Bio link**: points to the blog home; swap to the latest post around launch.
- **Image**: default to the post's OG card. Flag when the post earns a bespoke
  image or carousel, and sketch the carousel beats—one idea per card.
- **Hashtags**: 3–8 niche/topical tags—reuse the post's `tags` plus adjacent
  ones, kept as specific as the post.

## 4. Present

The caption (copy-paste ready), the image source or carousel sketch, and the
bio-link note. Write nothing to the repo.

## Notes

- **Voice.** Match the post's own register—conversational and first-person.
  This is alunduil's own surface.
- **Canonical-first.** The post links back to the blog, which stays canonical.
- **Trigger.** `/post-draft` flags image-prone posts as Instagram candidates;
  run this once the post is live (the link-back needs the published URL).
  dlvr.it covers the auto surfaces on publish.
