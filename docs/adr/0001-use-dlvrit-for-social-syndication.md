# 1. Use dlvr.it to syndicate posts to social platforms

## Status

Accepted

## Context and problem statement

The blog follows [POSSE]: it stays canonical, and each social platform
is a channel pointing back to it. Several surfaces are syndicated
automatically—Bluesky and Threads now, LinkedIn and others as the
strategy turns them on. (Instagram and Facebook are hand-crafted per
post and sit outside this decision.)

So the decision is not how to reach one network but which *mechanism*
drives the automated surfaces. For each the aim is identical: a
published post appears on its own—title, one-line hook, canonical
link—with no manual step and with failures left observable.

The feed already solves format. `https://blog.alunduil.com/rss.xml`
carries each post's title, `description` (the hook), and canonical link,
and `postFilter` excludes future-dated posts, so nothing syndicates
before its `pubDatetime`. What is unsettled is what turns a feed item
into a post—and the surfaces share no API: Bluesky speaks atproto,
Threads needs Meta's Graph API (sixty-day tokens, a registered app,
periodic refresh), the rest differ again. A self-hosted poster is
therefore one integration per surface, each with its own credentials
and failure handling—disproportionate against two posts in the first
half of 2026, and compounding with every channel added.

## Decision drivers

- **Cross-surface leverage**: one mechanism that spans every automated
  surface, rather than a separate integration built and maintained per
  platform API.
- **Maintenance burden** relative to a low, irregular posting cadence.
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
- **Self-hosted posters**—a GitHub Action per platform API (Meta Graph
  for Threads, atproto for Bluesky, and the rest) reading the feed.
- **Echofeed or atproto-native tooling**—the IndieWeb-favoured feed
  forwarders.
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
  syndication silently, so observability leans on the vendor's failure
  email plus a periodic manual check; opaque token storage; less format
  control than a hand-rolled poster; a mild step away from IndieWeb
  self-hosting.
- Neutral: reversible—nothing in the repository depends on dlvr.it, so
  swapping to self-hosted posters later is clean. Revisit when cadence
  makes format control matter, when dlvr.it degrades or drops a
  platform, or when failures slip past its alerting.

## Pros and cons of the options

### dlvr.it

- Good: no token-refresh upkeep; built-in failure dashboard and email
  cover observability; one account reaches every automated surface; the
  free tier covers this cadence; established vendor (since 2009).
- Bad: a commercial dependency in the publish path; format limited to
  vendor templates; the token sits with a third party whose storage is
  opaque.

### Self-hosted posters

- Good: no vendor in the trust path; full control over post format; no
  recurring cost.
- Bad: one integration per platform—Meta Graph's sixty-day token forces
  a refresh job and a self-renewing CI secret, atproto needs its own;
  each pipeline must track what it already sent to avoid double-posting;
  observability built from scratch. The cost repeats per surface and is
  heavy at low cadence, where a token expires idle more often than it
  serves a post.

### Echofeed or atproto-native tooling

- Good: the IndieWeb-favoured feed path; Echofeed is cheap and well
  regarded for Bluesky.
- Bad: Echofeed has no Threads (its targets are Bluesky, Mastodon,
  Micro.blog, Discord, and similar); atproto-native tooling is
  Bluesky-only. Neither spans the surfaces the strategy needs.

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
long-lived, self-renewing secret per platform in GitHub Actions—a wider
window, reachable by anyone with workflow write access or a malicious
dependency. For a low-stakes, revocable capability, keeping those
secrets off CI is the better trade.

## Community and ecosystem

POSSE is an IndieWeb practice, and the grain there leans self-hosted. A
commercial forwarder cuts mildly against it, accepted for the
maintenance saving across several surfaces at low cadence. Lock-in stays
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
