# Syndicate posts to Bluesky

This guide wires the blog's RSS feed to Bluesky through dlvr.it, so a
published post reaches Bluesky with no manual step. The reasoning behind
the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Bluesky account to post to.
- The blog's dlvr.it automation, per [Set up dlvr.it](set-up-dlvrit.md).

## Connect Bluesky to dlvr.it

1. Sign in to dlvr.it and open the Outputs tab.
2. Add Bluesky as an output and connect with the account handle and a
   Bluesky app password (create one under Bluesky's Settings, App
   Passwords). The app password grants dlvr.it permission to post and
   nothing more, and you can revoke it later by deleting it in those
   same Bluesky settings.

## Add Bluesky to the blog's automation

1. Open the Automate tab, open the automation reading
   `https://blog.alunduil.com/rss.xml`, and choose Add Output.
2. Pick the connected Bluesky output.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Post the title and a link card

Open the Bluesky output from the Outputs tab and choose Edit. Under Post
options, set:

- Post title: on
- Post body: off
- Post URL: on
- Post photo: on

Leave Begin posts with and End posts with empty. The post is the item's
title as the message, with a link card built from the post's
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

A post that never arrives points at the automation, the Bluesky app
password, or the feed.
