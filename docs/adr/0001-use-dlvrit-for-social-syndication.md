# 1. Use dlvr.it to syndicate posts to social platforms

## Status

Accepted

## Context and problem statement

The blog follows [POSSE]: it stays canonical, and each social platform
is a channel pointing back to it. Several platforms are syndicated
automatically; the open question is not which networks to reach but the
*mechanism* that drives them. For each the aim is identical: a published
post appears on its own—title, one-line hook, canonical link—with no
manual step, and failures stay observable.

The feed already solves format. `https://blog.alunduil.com/rss.xml`
carries each post's title, `description` (the hook), and canonical link.
`postFilter` excludes future-dated posts, so nothing syndicates before
its `pubDatetime`. What is unsettled is what turns a feed item
into a post—and the surfaces share no API: Bluesky speaks atproto,
Threads goes through Meta's Threads API (sixty-day tokens, a registered
app, periodic refresh), the rest differ again. A self-hosted poster is
therefore one integration per surface, each with its own credentials
and failure handling—a standing build-and-maintain cost that falls on a
single author and compounds with every channel added.

## Decision drivers

- **Cross-surface leverage**: one mechanism that spans every automated
  surface, rather than a separate integration built and maintained per
  platform API.
- **Maintenance burden**: standing upkeep that stays near zero for a
  single author.
- **Security and credential exposure**: where the posting credential
  lives and what a compromise reaches.
- **Community and ecosystem fit** with POSSE and IndieWeb norms, plus
  vendor longevity against young, shifting platform APIs.
- **Pipeline observability**: breakage and token-refresh failure must
  be noticeable.
- **Format control** and **cost**.
- **Reversibility**: how cleanly the choice can be unwound later.

## Considered options

- **dlvr.it**—a third-party forwarder that reads the RSS feed and posts
  to each connected platform.
- **Self-hosted posters**—a GitHub Action per platform API (the Threads
  API for Threads, atproto for Bluesky, and the rest) reading the feed.
- **Echofeed or atproto-native tooling**—the IndieWeb-favoured feed
  forwarders.
- **Jetpack Social (Automattic)**—WordPress's built-in Publicize,
  sharing on publish to eight platforms; presupposes running WordPress.
- **Stay manual**—no automation; post by hand.

## Decision outcome

Chosen: **dlvr.it**. One account forwards the feed to Bluesky and
Threads now, and to LinkedIn and the rest whenever the strategy turns
them on—same feed, same credential model, no per-platform integration.
It hits the automated-surface aim with near-zero maintenance, keeps no
secret in the repository or CI, and pushes each platform's API churn
onto the vendor.

Setup is account configuration in dlvr.it (connect each platform, add
the RSS source), not repository code. The only artefacts are this ADR
and the how-to under `docs/how-to/`.

### Consequences

- Good: the vendor owns token refresh; one account spans every
  automated surface; no secret lives in the repository or CI; the feed
  already supplies format and excludes scheduled posts.
- Bad: a vendor in the publish path—an outage or shutdown stops
  syndication silently, so observability leans on dlvr.it's failure
  alerts (configurable once the route is established), backed by a manual
  check until they are; opaque token storage; less format control than a
  hand-rolled poster; a mild step away from IndieWeb self-hosting.
- Neutral: reversible—nothing in the repository depends on dlvr.it, so
  swapping to self-hosted posters later is clean. Revisit when cadence
  makes format control matter, when dlvr.it degrades or drops a
  platform, or when failures slip past its alerting.

## Pros and cons of the options

### dlvr.it

- Good: no token-refresh upkeep; built-in failure alerts cover
  observability; one account reaches every automated surface; the free
  tier (one feed, three socials) covers the plan, with a paid tier
  triggered only by a fourth automated surface or a second feed;
  long-established vendor (since 2009).
- Bad: a commercial dependency in the publish path; format limited to
  vendor templates; the token sits with a third party whose storage is
  opaque.

### Self-hosted posters

- Good: no vendor in the trust path; full control over post format; no
  recurring cost.
- Bad: one integration per platform—the Threads API's sixty-day token
  forces a refresh job and a renewing CI secret, while atproto needs a
  separate integration with its own static credential; each pipeline
  must track what it already sent to avoid double-posting; observability
  built from scratch. The cost repeats per surface and lands on one
  maintainer.

### Echofeed or atproto-native tooling

- Good: the IndieWeb-favoured feed path; Echofeed is cheap and well
  regarded for Bluesky.
- Bad: Echofeed has no Threads (its targets are Bluesky, Mastodon,
  Micro.blog, Discord, and similar); atproto-native tooling is
  Bluesky-only. Neither spans the surfaces the strategy needs.

### Jetpack Social

- Good: free tier with unlimited shares, and native reach across every
  surface this blog would automate.
- Bad: it runs only as a WordPress plugin, hooking the publish action
  with no feed path. This blog is a static Astro site, so it does not
  apply without migrating the whole blog to WordPress.

### Stay manual

- Good: nothing to build, no dependency, full editorial control per
  post.
- Bad: fails the no-manual-step aim; relies on the author
  remembering—the thing POSSE automation exists to remove.

## Security and credential exposure

Both automated options delegate one narrow capability: create posts on
the connected accounts. Neither reaches the blog, the repository, or any
infrastructure, and the source RSS is public, so nothing sensitive
enters the pipeline. The routes differ only in where the credential
sits.

With dlvr.it the tokens live with the vendor, not in the repository or
CI. A dlvr.it compromise exposes posting across its customers; this
blog's blast radius is unwanted posts on the connected accounts,
revocable in one action per platform. The cost is opaque vendor storage.

Self-hosting keeps the tokens out of any third party but puts a
long-lived secret per platform in GitHub Actions—Meta's on a sixty-day
refresh treadmill, Bluesky's a static app password—widening the window:
reachable by anyone with workflow write access or a malicious
dependency. For a low-stakes, revocable capability, keeping those
secrets off CI is the better trade.

## Community and ecosystem

POSSE is an IndieWeb practice, and the grain there leans self-hosted. A
commercial forwarder cuts mildly against it, accepted for the
maintenance saving across several surfaces. Lock-in stays
bounded: the blog stays canonical, so each network is a reach channel
pointing home, not the home itself.

Threads is a proprietary Meta silo—syndicating there is a reach
concession regardless of mechanism. Bluesky, on the open atproto
protocol, is more community-aligned; routing it through the same vendor
is convenient, with Echofeed as the vendor-neutral fallback if that
matters later.

## More information

- [POSSE], the IndieWeb pattern this strategy follows.
- Setup steps: `docs/how-to/syndicate-posts-to-threads.md`.
- Format and scheduling guarantees come from `src/pages/rss.xml.ts` and
  `src/utils/postFilter.ts`.

[POSSE]: https://indieweb.org/POSSE
