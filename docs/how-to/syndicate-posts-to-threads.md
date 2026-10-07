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

1. Sign in to dlvr.it and open the Outputs tab.
2. Add Threads as an output and complete the Meta authorisation. This
   grants dlvr.it permission to post to the account and nothing more,
   and you can revoke it later from the Threads account settings.

## Add Threads to the blog's automation

One dlvr.it automation reads the blog's feed and posts to every
connected social, so each social is an output on that automation.

1. Open the Automate tab. If an automation with the input
   `https://blog.alunduil.com/rss.xml` exists, open it and choose Add
   Output. Otherwise, create a New Automation with that URL as its
   input.
2. Pick the connected Threads output.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Choose the summary over the full body

In the automation's Settings, under Advanced, set Body posting options
to Prefer summary content. Each item carries two blocks of text:
`description`, the one-line hook, and `content:encoded`, the whole post
rendered for feed readers. An automation preferring full content posts
the whole article, cut off at the character limit. The setting applies
to every output on the automation.

## Post the title and link

Open the Threads output from the Outputs tab and choose Edit. Under Post
options, set:

- Post title: on
- Post body: off
- Post URL: on
- Post photo: on

Leave Begin posts with and End posts with empty. With the body off, the
post is the item's title, a link, and the post's social image, which
the automation picks first under Advanced, Image selection order, Open
Graph tags first:

```text
How I Back Up http://dlvr.it/<id>
```

## Verify

1. Trigger a manual check, or wait for the next post to publish.
2. Confirm a Threads post appears. The visible link points at
   `dlvr.it`, so follow the redirect to confirm it lands on the
   canonical URL.

dlvr.it checks the feed on a schedule rather than on publish, so a new
post appears at the next check—a short delay is not a failure.

A post that never arrives points at the automation, the Threads
authorisation, or the feed.
