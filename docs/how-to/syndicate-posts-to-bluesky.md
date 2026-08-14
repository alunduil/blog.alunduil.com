# Syndicate posts to Bluesky

This guide wires the blog's RSS feed to Bluesky through dlvr.it, so a
published post reaches Bluesky with no manual step. The reasoning behind
the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Bluesky account to post to.
- The published feed at `https://blog.alunduil.com/rss.xml`. It already
  carries each post's title, description, full body, and canonical link,
  and it excludes future-dated (scheduled) posts, so nothing syndicates
  before its `pubDatetime`.
- A dlvr.it account; the free tier covers this blog's volume.

The dlvr.it labels below may shift as its interface changes; match the
intent rather than the exact wording.

## Connect Bluesky to dlvr.it

1. Sign in to dlvr.it and open the Socials tab.
2. Choose Add Social, pick Bluesky, and connect with the account handle
   and a Bluesky app password (create one under Bluesky's Settings, App
   Passwords). The app password grants dlvr.it permission to post and
   nothing more, and you can revoke it later by deleting it in those
   same Bluesky settings.

## Add the feed and route it to Bluesky

1. Open the Feeds tab and add the URL
   `https://blog.alunduil.com/rss.xml`.
2. Route the feed to the connected Bluesky social.
3. On the first sync, limit how many existing items post, so the back
   catalogue does not flood the timeline. Posting only new items from
   here on is the goal.

## Choose the summary over the full body

Set this feed to prefer summary content, under its advanced settings.
Each item carries two blocks of text: `description`, the one-line hook,
and `content:encoded`, the whole post rendered for feed readers. dlvr.it
calls them Summary and Full Body. A route preferring full content posts
the whole article, cut off at the character limit.

## Keep the default post format

Leave the route's post template alone. Its default posts the item's
title as the message and attaches a link card carrying that title, the
one-line hook from the post's `description`, and the post's social
image. dlvr.it shortens the link through its own `dlvr.it` domain, and
that short link redirects to the canonical URL with
`utm_source=dlvr.it&utm_medium=bluesky` appended, so referrals stay
attributable. A finished post reads:

```text
Off the Desk
┌───────────────────────────────────────────────────────────┐
│ [social image]                                            │
│ Off the Desk                                              │
│ GitHub dropped my one model from Copilot. I went to       │
│ Claude, and the work came off the desk onto my phone.     │
│ blog.alunduil.com                                         │
└───────────────────────────────────────────────────────────┘
```

Bluesky's 300-character limit applies to the message text, which a
title alone barely touches; the card sits outside it. Repeating the
hook in the message would duplicate the card, so change the template
only when a later review shows the need.

## Verify

1. Trigger a manual check, or wait for the next post to publish.
2. Confirm a Bluesky post appears for it. The visible link points at
   `dlvr.it`, so follow the redirect to confirm it lands on the
   canonical URL.

On the free tier, dlvr.it polls the feed every six hours, so a new post
can take that long to appear—a short delay is not a failure.

## Notice when it breaks

This pipeline has to make breakage observable. Two layers cover it:

- dlvr.it emails on feed or posting errors and shows route health on
  its dashboard. Keep those emails reaching an inbox you read.
- Once a month, or after publishing, confirm the latest post reached
  Bluesky. A missing post is the signal that the route, the Bluesky app
  password, or the feed has stopped working.

If the pipeline needs replacing, nothing in this repository depends on
dlvr.it. Bluesky runs on the open atproto protocol, so a vendor-neutral
forwarder or a small self-hosted poster can take over its route later.
ADR 0001 records that alternative and the triggers for revisiting the
choice.
