# Syndicate posts to Threads

This guide wires the blog's RSS feed to Threads through dlvr.it, so a
published post reaches Threads with no manual step. The reasoning behind
the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Threads account to post to.
- The blog's dlvr.it automation, per [Set up dlvr.it](set-up-dlvrit.md).

## Connect Threads to dlvr.it

1. Sign in to dlvr.it and open the Outputs tab.
2. Add Threads as an output and complete the Meta authorisation. This
   grants dlvr.it permission to post to the account and nothing more,
   and you can revoke it later from the Threads account settings.

## Add Threads to the blog's automation

1. Open the Automate tab, open the automation reading
   `https://blog.alunduil.com/rss.xml`, and choose Add Output.
2. Pick the connected Threads output.
3. Limit the first sync, so the back catalogue does not flood the
   timeline.

## Post the title and link

Open the Threads output from the Outputs tab and choose Edit. Under Post
options, set:

- Post title: on
- Post body: off
- Post URL: on
- Post photo: on

Leave Begin posts with and End posts with empty. With the body off, the
post is the item's title, a link, and the post's social image:

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
