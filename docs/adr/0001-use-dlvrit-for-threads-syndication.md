# 1. Use dlvr.it to syndicate posts to Threads

## Status

Accepted

## Context and problem statement

The blog follows POSSE (Publish on your Own Site, Syndicate Elsewhere):
the blog stays canonical and social platforms are notification channels
that point back to it. Issue #78 asks for Threads to receive a post
automatically—title, a one-line hook, and the canonical link—with
no manual step, and for pipeline or token failures to be observable.

Two facts narrow the problem. The RSS feed at
`https://blog.alunduil.com/rss.xml` already carries each post's title,
`description` (the hook), and canonical link, and `postFilter` keeps
future-dated (scheduled) posts out of the feed, so a feed-driven
pipeline cannot leak a post before its `pubDatetime`. Format is
therefore already solved; the open question is the *mechanism* that
turns a feed item into a Threads post.

Posting to Threads goes through Meta's Graph API. Its long-lived access
tokens expire at roughly sixty days and must be refreshed before then,
and posting needs a registered Meta app. The blog's real posting
cadence is low (two author posts in the first half of 2026), which
makes any standing token-refresh machinery disproportionate to the
traffic it serves.

## Decision drivers

- **Maintenance burden** relative to a low, irregular posting cadence.
- **Security and credential exposure**: where the posting credential
  lives and what a compromise reaches.
- **Community and ecosystem fit** with POSSE and IndieWeb norms, plus
  vendor longevity against a young, shifting Threads API.
- **Pipeline observability**: breakage and token-refresh failure must
  be noticeable (an explicit acceptance criterion).
- **Format control** and **cost**.
- **Reversibility**: how cleanly the choice can be unwound later.

## Considered options

- **dlvr.it**—a third-party forwarder that reads the RSS feed and
  posts to Threads.
- **Meta Graph API direct**—a self-hosted GitHub Action that reads
  the feed and posts via the Graph API.
- **Echofeed or atproto-native tooling**—the IndieWeb-favoured feed
  forwarders.
- **Stay manual**—no automation; post to Threads by hand.

## Decision outcome

Chosen option: **dlvr.it**, because it satisfies the acceptance
criteria with near-zero standing maintenance, keeps the posting
credential off the repository and CI, and absorbs Threads-API churn on
vendor's side. dlvr.it also forwards to Bluesky, so the same account
and feed could serve #77 (Bluesky), whose mechanism is still open; this
ADR scopes the decision to Threads and only notes the potential reuse.

The work is account setup in dlvr.it (connect the Threads account, add
the RSS source), not repository code. The only artefacts are this ADR
and the setup how-to under `docs/how-to/`.

### Consequences

- Good: near-zero maintenance, with the vendor owning token refresh;
  one account can also cover Bluesky (#77); no secret lives in the
  repository or CI; the existing feed supplies the format and already
  excludes
  scheduled posts.
- Bad: a vendor dependency whose outage or shutdown stops syndication
  quietly, so observability rests on the vendor's failure email plus a
  periodic manual check; dlvr.it's token storage cannot be audited;
  less format control than a hand-rolled poster; a mild departure from
  IndieWeb self-hosting norms.
- Neutral: the choice is reversible—nothing in the repository depends on
  dlvr.it, so moving to the Graph API later is a clean swap. Revisit
  when posting cadence rises enough that format control matters, when
  dlvr.it degrades or drops Threads support, or when failures slip past
  the vendor's alerting often enough to justify owned observability.

## Pros and cons of the options

### dlvr.it

- Good: zero token-refresh upkeep; built-in failure dashboard and email
  satisfy the observability criterion; one account also reaches
  Bluesky; the free tier comfortably covers this cadence; long-
  established vendor (operating since 2009).
- Bad: a commercial dependency in the publish path; format control is
  limited to the vendor's templates; the access token sits with a
  third party whose storage cannot be inspected.

### Meta Graph API direct

- Good: no vendor in the trust path; full control over post format;
  no recurring cost.
- Bad: the sixty-day long-lived token forces a standing refresh job and
  a self-renewing secret in CI; the pipeline must track which posts it
  already sent to avoid double-posting; observability must be built
  from scratch.
  All of this is heavy against a low cadence—the token is likelier to
  expire idle than to serve a post.

### Echofeed or atproto-native tooling

- Good: the IndieWeb-favoured path for feed syndication; Echofeed is
  inexpensive and well regarded for Bluesky.
- Bad: Echofeed does not support Threads (its targets are Bluesky,
  Mastodon, Micro.blog, Discord, and similar), so it cannot satisfy
  this issue; atproto-native tooling is Bluesky-only by construction.
  Relevant to #77, not to Threads.

### Stay manual

- Good: nothing to build, no dependency, full editorial control per
  post.
- Bad: fails the acceptance criterion of no manual intervention; relies
  on the author remembering, which is exactly what POSSE automation is
  meant to remove.

## Security and credential exposure

Both automated options delegate the same narrow capability: create
posts on the connected social account. Neither can reach the blog, the
repository, or any infrastructure, and the source RSS is public, so
nothing sensitive flows into the pipeline.

The routes differ in where the credential lives. With dlvr.it the
delegated token is held by the vendor, not by the repository or CI; a
compromise of dlvr.it exposes posting capability across its customers,
with this blog's blast radius bounded to unwanted posts on the
connected accounts, and revocation is a single action in the Threads
(and Bluesky) account settings. The cost is opaque vendor storage.

The self-hosted route keeps the token out of any third party but places
a long-lived, self-renewing secret in GitHub Actions, widening the
exposure window: anyone with write access to the workflow, or a
malicious dependency pulled into it, could extract the token. Given
the capability is low-stakes and revocable, moving the secret off our
own CI is the better trade for this blog.

## Community and ecosystem

POSSE is an IndieWeb practice, and the IndieWeb grain leans toward
self-hosted or community tooling. A commercial forwarder cuts mildly
against that grain, accepted here for the maintenance saving at low
cadence. The lock-in stays bounded because the blog remains canonical:
Threads is a reach channel pointing home, not the home itself.

Threads is a proprietary Meta silo, so syndicating to it is a reach
concession regardless of mechanism. Bluesky, built on the open atproto
protocol, is the more community-aligned channel; pairing it through the
same vendor is convenient, though Echofeed remains the vendor-neutral
Bluesky path if that matters later. The Threads API is young and still
shifting; both routes inherit that churn, but the vendor absorbs the
upkeep in the chosen one.

## More information

- Issue #78 (Threads syndication) and #77 (Bluesky), part of the tiered
  strategy in #55 and #79–#81.
- Setup steps: `docs/how-to/syndicate-posts-to-threads.md`.
- Format and scheduling guarantees come from `src/pages/rss.xml.ts` and
  `src/utils/postFilter.ts`.
