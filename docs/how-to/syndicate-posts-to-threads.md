# Syndicate posts to Threads

This guide wires the blog's RSS feed to Threads through dlvr.it, so a
published post reaches Threads with no manual step. The reasoning behind
the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Threads account to post to.
- The published feed at `https://blog.alunduil.com/rss.xml`. It already
  carries each post's title, description, and canonical link, and it
  excludes future-dated (scheduled) posts, so nothing syndicates before
  its `pubDatetime`.
- A dlvr.it account; the free tier covers this blog's volume.

The dlvr.it labels below may shift as its interface changes; match the
intent rather than the exact wording.

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
3. On the first sync, limit how many existing items post, so the back
   catalogue does not flood the timeline. Posting only new items from
   here on is the goal.

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

On the free tier, dlvr.it polls the feed every six hours, so a new post
can take that long to appear—a short delay is not a failure.

## Notice when it breaks

This pipeline has to make breakage observable. Two layers cover it:

- dlvr.it emails on feed or posting errors and shows route health on
  its dashboard. Keep those emails reaching an inbox you read.
- Once a month, or after publishing, confirm the latest post reached
  Threads. A missing post is the signal that the route, the Threads
  authorisation, or the feed has stopped working.

If the pipeline needs replacing, nothing in this repository depends on
dlvr.it. ADR 0001 records the self-hosted alternative and the triggers
for revisiting the choice.
