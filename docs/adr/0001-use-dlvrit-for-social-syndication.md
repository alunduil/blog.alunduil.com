# 1. Use dlvr.it to syndicate posts to social platforms

## Status

Accepted

## Context and problem statement

The blog follows [POSSE] (Publish on your Own Site, Syndicate
Elsewhere): the blog stays canonical and social platforms are
notification channels that point back to it. The syndication strategy
is tiered across several surfaces—Bluesky and Threads posted
automatically, Instagram and Facebook hand-crafted per post, LinkedIn
and a newsletter deferred until they earn their place. So the decision
is not how to reach one network but which *mechanism* drives
syndication across the surfaces the strategy turns on.

For the automated surfaces the aim is the same on each: a published
post appears there on its own—title, a one-line hook, and the canonical
link—with no manual step, and pipeline or token failures stay
observable.

Format is already solved for any feed-driven consumer. The RSS feed at
`https://blog.alunduil.com/rss.xml` carries each post's title,
`description` (the hook), and canonical link, and `postFilter` keeps
future-dated (scheduled) posts out of the feed, so a feed-driven
pipeline cannot post anything before its `pubDatetime`. The open
question is the mechanism that turns a feed item into a post.

The surfaces do not share an API. Bluesky speaks atproto; Threads goes
through Meta's Graph API, whose long-lived tokens expire at roughly
sixty days and need a registered Meta app and periodic refresh; the
others differ again. A self-hosted poster is therefore not one
integration but one per surface, each with its own credentials, token
life cycle, and failure handling. Against the blog's low posting cadence
(two author posts in the first half of 2026), that per-surface
machinery is disproportionate, and it compounds with every channel the
strategy adds.

## Decision drivers

- **Cross-surface leverage**: one mechanism that spans the strategy's
  platforms, rather than a separate integration built and maintained
  per platform API.
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

Chosen option: **dlvr.it**, because one account spans the strategy's
surfaces. It forwards to Bluesky and Threads today, and to LinkedIn and
other networks the strategy may turn on later, so the same feed and
credential model scale across channels with no integration built per
platform. It meets the automated-surface aim with near-zero standing
maintenance, keeps the posting credential off the repository and CI,
and absorbs each platform's API churn on the vendor's side.

The work is account setup in dlvr.it (connect each platform, add the
RSS source), not repository code. The only artefacts are this ADR and
the setup how-to under `docs/how-to/`.

### Consequences

- Good: near-zero maintenance, with the vendor owning token refresh;
  one account spans every surface the strategy automates; no secret
  lives in the repository or CI; the existing feed supplies the format
  and already excludes scheduled posts.
- Bad: a vendor dependency whose outage or shutdown stops syndication
  quietly, so observability rests on the vendor's failure email plus a
  periodic manual check; dlvr.it's token storage cannot be audited;
  less format control than a hand-rolled poster; a mild departure from
  IndieWeb self-hosting norms.
- Neutral: the choice is reversible—nothing in the repository depends on
  dlvr.it, so moving to self-hosted posters later is a clean swap.
  Revisit when posting cadence rises enough that format control matters,
  when dlvr.it degrades or drops a platform, or when failures slip past
  the vendor's alerting often enough to justify owned observability.

## Pros and cons of the options

### dlvr.it

- Good: zero token-refresh upkeep; built-in failure dashboard and email
  satisfy the observability driver; one account reaches every surface
  the strategy automates; the free tier comfortably covers this cadence;
  long-established vendor (operating since 2009).
- Bad: a commercial dependency in the publish path; format control is
  limited to the vendor's templates; the access token sits with a third
  party whose storage cannot be inspected.

### Self-hosted posters

- Good: no vendor in the trust path; full control over post format; no
  recurring cost.
- Bad: each platform is a separate integration—Meta Graph's sixty-day
  token forces a standing refresh job and a self-renewing secret in CI,
  atproto needs its own; each pipeline must track which posts
  it already sent to avoid double-posting; observability must be built
  from scratch. The cost repeats per surface and is heavy against a low
  cadence, where a token is likelier to expire idle than to serve a
  post.

### Echofeed or atproto-native tooling

- Good: the IndieWeb-favoured path for feed syndication; Echofeed is
  inexpensive and well regarded for Bluesky.
- Bad: Echofeed does not support Threads (its targets are Bluesky,
  Mastodon, Micro.blog, Discord, and similar), and atproto-native
  tooling is Bluesky-only by construction. Neither spans the surfaces
  the strategy needs.

### Stay manual

- Good: nothing to build, no dependency, full editorial control per
  post.
- Bad: fails the aim of no manual intervention; relies on the author
  remembering, which is exactly what POSSE automation is meant to
  remove.

## Security and credential exposure

Both automated options delegate the same narrow capability: create
posts on the connected accounts. Neither can reach the blog, the
repository, or any infrastructure, and the source RSS is public, so
nothing sensitive flows into the pipeline.

The routes differ in where the credential lives. With dlvr.it the
delegated tokens are held by the vendor, not by the repository or CI; a
compromise of dlvr.it exposes posting capability across its customers,
with this blog's blast radius bounded to unwanted posts on the
connected accounts, and revocation is a single action in each
platform's account settings. The cost is opaque vendor storage.

The self-hosted route keeps the tokens out of any third party but
places a long-lived, self-renewing secret per platform in GitHub
Actions, widening the exposure window: anyone with write access to the
workflow, or a malicious dependency pulled into it, could extract them.
Given the capability is low-stakes and revocable, moving the secrets
off our own CI is the better trade for this blog.

## Community and ecosystem

POSSE is an IndieWeb practice, and the IndieWeb grain leans toward
self-hosted or community tooling. A commercial forwarder cuts mildly
against that grain, accepted here for the maintenance saving at low
cadence across several surfaces. The lock-in stays bounded because the
blog remains canonical: each network is a reach channel pointing home,
not the home itself.

Threads is a proprietary Meta silo, so syndicating to it is a reach
concession regardless of mechanism. Bluesky, built on the open atproto
protocol, is the more community-aligned channel; routing it through the
same vendor is convenient, though Echofeed remains the vendor-neutral
Bluesky path if that matters later. The platform APIs are young and
still shifting; both routes inherit that churn, but the vendor absorbs
the upkeep in the chosen one.

## More information

- [POSSE], the IndieWeb pattern this strategy follows.
- Setup steps: `docs/how-to/syndicate-posts-to-threads.md`.
- Format and scheduling guarantees come from `src/pages/rss.xml.ts` and
  `src/utils/postFilter.ts`.

[POSSE]: https://indieweb.org/POSSE
