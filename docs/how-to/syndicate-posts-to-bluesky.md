# Syndicate posts to Bluesky

This guide wires the blog's feeds to Bluesky through dlvr.it, so a
published post, review, or note reaches Bluesky with no manual step. The
reasoning behind the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Bluesky account to post to.
- A dlvr.it automation for each feed, per [Set up dlvr.it](set-up-dlvrit.md).

## Connect Bluesky to dlvr.it

1. Sign in to dlvr.it and open the Outputs tab.
2. Add Bluesky as an output and connect with the account handle and a
   Bluesky app password (create one under Bluesky's Settings, App
   Passwords). The app password grants dlvr.it permission to post and
   nothing more, and you can revoke it later by deleting it in those
   same Bluesky settings.

## Add Bluesky to each automation

Repeat for each automation reading `https://blog.alunduil.com/rss.xml`,
`https://blog.alunduil.com/reviews/rss.xml`, and
`https://blog.alunduil.com/notes/rss.xml`.

1. Open the Automate tab, open the automation, and choose Add Output.
2. Pick the connected Bluesky output.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Send posts and reviews as a title and link card

The link card already shows the hook, so the message needs only the
title. Keeping the body off also keeps the article text out of the
post. Apply these settings in the posts automation and the reviews one.

1. In the automation, open its Bluesky output.
2. Under Post options, turn Post title, Post URL, and Post photo on,
   and Post body off.
3. Leave Begin posts with and End posts with empty.

The post reads:

```text
How I Back Up
[link card: title, the post's one-line hook, social image]
```

The card links to a `dlvr.it` URL that redirects to the canonical one
with `utm_source` and `utm_medium` appended.

## Send notes as their text

A note is the post, so it goes out as its text alone. Bluesky caps a
post at 300 characters and dlvr.it truncates anything longer, so a
link would spend characters the note needs.

1. In the notes automation, open its Bluesky output.
2. Under Post options, turn Post body on, and Post title, Post URL, and
   Post photo off.
3. Leave Begin posts with and End posts with empty.

## Verify

1. Trigger a manual check, or wait for the next entry to publish.
2. Confirm a Bluesky post appears for it. For a post or review, the
   visible link points at `dlvr.it`, so follow the redirect to confirm
   it lands on the canonical URL. For a note, confirm the text arrives
   whole.

dlvr.it checks each feed on a schedule rather than on publish, so a new
entry appears at the next check—a short delay is not a failure.

A post that never arrives points at the automation, the Bluesky app
password, or the feed.
