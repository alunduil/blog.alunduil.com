# Syndicate posts to Threads

This guide wires the blog's feeds to Threads through dlvr.it, so a
published post, review, or note reaches Threads with no manual step. The
reasoning behind the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Threads account to post to.
- A dlvr.it automation for each feed, per [Set up dlvr.it](set-up-dlvrit.md).

## Connect Threads to dlvr.it

1. Sign in to dlvr.it and open the Outputs tab.
2. Add Threads as an output and complete the Meta authorisation. This
   grants dlvr.it permission to post to the account and nothing more,
   and you can revoke it later from the Threads account settings.

## Add Threads to each automation

Repeat for each automation reading `https://blog.alunduil.com/rss.xml`,
`https://blog.alunduil.com/reviews/rss.xml`, and
`https://blog.alunduil.com/notes/rss.xml`.

1. Open the Automate tab, open the automation, and choose Add Output.
2. Pick the connected Threads output.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Send posts and reviews as a title and link

Keeping the body off keeps the article text out of the post. Apply
these settings in the posts automation and the reviews one.

1. In the automation, open its Threads output.
2. Under Post options, turn Post title, Post URL, and Post photo on,
   and Post body off.
3. Leave Begin posts with and End posts with empty.

The post is the item's title, a link, and the post's social image:

```text
How I Back Up http://dlvr.it/<id>
```

## Send notes as their text and link

A note is the post, so its text replaces the title. The link leads to
the note's page, which carries its source.

1. In the notes automation, open its Threads output.
2. Under Post options, turn Post body and Post URL on, and Post title
   and Post photo off.
3. Leave Begin posts with and End posts with empty.

The post is the note's text followed by a link:

```text
I added actions/stale to four of my repositories… http://dlvr.it/<id>
```

## Verify

1. Trigger a manual check, or wait for the next entry to publish.
2. Confirm a Threads post appears. The visible link points at
   `dlvr.it`, so follow the redirect to confirm it lands on the
   canonical URL.

dlvr.it checks each feed on a schedule rather than on publish, so a new
entry appears at the next check—a short delay is not a failure.

A post that never arrives points at the automation, the Threads
authorisation, or the feed.
