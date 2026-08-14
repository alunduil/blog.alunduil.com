# Syndicate posts to Threads

This guide wires the blog's RSS feed to Threads through dlvr.it, so a
published post reaches Threads with no manual step. The reasoning behind
the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Threads account to post to.
- The published feed at `https://blog.alunduil.com/rss.xml`. It already
  carries each post's title, description, full body, and canonical link,
  and it excludes future-dated (scheduled) posts, so nothing syndicates
  before its `pubDatetime`.
- A dlvr.it account, per [Set up dlvr.it](set-up-dlvrit.md).

## Connect Threads to dlvr.it

1. Sign in to dlvr.it and open the Socials tab.
2. Choose Add Social, pick Threads, and complete the Meta
   authorisation. This grants dlvr.it permission to post to the
   account and nothing more, and you can revoke it later from the
   Threads account settings.

## Add the feed and route it to Threads

1. Open the Feeds tab and add the URL
   `https://blog.alunduil.com/rss.xml`.
2. Route the feed to the connected Threads social.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Choose the summary over the full body

Set this feed to prefer summary content, under its advanced settings.
Each item carries two blocks of text: `description`, the one-line hook,
and `content:encoded`, the whole post rendered for feed readers. dlvr.it
calls them Summary and Full Body. A route preferring full content posts
the whole article, cut off at the character limit.

## Set the post format

Match the canonical shape: title, the one-line hook, and the link back.
In the route's post template, build the message from the feed's title
and description fields, and let dlvr.it append the canonical link. A
finished post reads roughly:

```text
How I Back Up — <the post's one-line description>
https://blog.alunduil.com/posts/how-i-back-up
```

Threads allows 500 characters, and the link counts against that, so a
title, hook, and canonical URL still fit with room to spare. Keep the
message lean for the reader, not the limit, and add to it only when a
later review shows the need.

## Verify

1. Trigger a manual check, or wait for the next post to publish.
2. Confirm a Threads post appears that points at the canonical URL.

dlvr.it checks the feed on a schedule rather than on publish, so a new
post appears at the next check—a short delay is not a failure.

## Notice when it breaks

Once a month, or after publishing, confirm the latest post reached
Threads. A missing post is the signal that the route, the Threads
authorisation, or the feed has stopped working. The standing alerts that
catch the rest are in
[Set up dlvr.it](set-up-dlvrit.md#notice-when-it-breaks).
