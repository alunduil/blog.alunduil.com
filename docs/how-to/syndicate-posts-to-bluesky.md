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
- A dlvr.it account, per [Set up dlvr.it](set-up-dlvrit.md).

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
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Choose the summary over the full body

Set this feed to prefer summary content, under its advanced settings.
Each item carries two blocks of text: `description`, the one-line hook,
and `content:encoded`, the whole post rendered for feed readers. dlvr.it
calls them Summary and Full Body. A route preferring full content posts
the whole article, cut off at the character limit.

## Keep the default post format

Leave the route's post template alone. By default it posts the item's
title as the message and attaches a link card built from the post's
`description` and social image:

```text
How I Back Up
[link card: title, the post's one-line hook, social image]
```

Composing a richer message repeats what the card already shows. dlvr.it
also shortens the link: the card points at a `dlvr.it` URL that
redirects to the canonical one with `utm_source` and `utm_medium`
appended.

## Verify

1. Trigger a manual check, or wait for the next post to publish.
2. Confirm a Bluesky post appears for it. The visible link points at
   `dlvr.it`, so follow the redirect to confirm it lands on the
   canonical URL.

dlvr.it checks the feed on a schedule rather than on publish, so a new
post appears at the next check—a short delay is not a failure.

A post that never arrives points at the route, the Bluesky app password,
or the feed.
