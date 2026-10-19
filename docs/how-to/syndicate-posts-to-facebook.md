# Syndicate posts to Facebook

This guide wires the blog's posts and reviews feeds to a Facebook Page
through dlvr.it, so a published post or review reaches Facebook with no
manual step. The reasoning behind the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

## Before you start

- A Facebook Page to post to. Facebook's API lets dlvr.it post to Pages
  but not to personal or professional profiles.
- A personal Facebook profile with full control of that Page, under the
  Page's Settings, Page access.
- A dlvr.it automation for each of the posts and reviews feeds, per
  [Set up dlvr.it](set-up-dlvrit.md).

## Connect the Page to dlvr.it

1. Sign in to dlvr.it, open the Outputs tab, and add Facebook as an
   output.
2. Log in to Facebook as the personal profile, not as the Page.
3. Keep every permission Facebook offers selected, tick the Page, and
   finish with Add to dlvr.it. A declined permission can hide the Page
   from dlvr.it.

If dlvr.it reports no Pages after login, open Facebook's Settings,
Business integrations, choose View and edit on dlvr.it, and tick the
Page. If the Page still does not appear, remove dlvr.it there and
connect again.

## Add the Page to the posts and reviews feeds

Posts and reviews arrive on separate feeds, so the Page is an output on
the automation for each.

1. Open the Automate tab, open the automation reading
   `https://blog.alunduil.com/rss.xml`, and choose Add Output.
2. Pick the connected Facebook Page.
3. Start with the next new item, so the back catalogue does not post.
4. Repeat for the automation reading
   `https://blog.alunduil.com/reviews/rss.xml`.

## Post the title and a link card

The link card already shows the hook, so the message needs only the
title. Keeping the body off keeps the hook from printing twice.

Set each of the two Facebook outputs the same way:

1. Open the output from the Outputs tab and choose Edit.
2. Under Post options, set Post style to Shared link.
3. Turn Post title, Post URL, and Post photo on, and Post body off.
4. Leave Begin posts with and End posts with empty.

The post reads:

```text
How I Back Up
[link card: title, the post's one-line hook, social image]
```

## Verify

1. Trigger a manual check, or wait for the next post or review to
   publish.
2. Confirm a Page post appears with a link card, and follow the link to
   confirm it lands on the canonical URL.

dlvr.it checks the feed on a schedule rather than on publish, so a new
post appears at the next check—a short delay is not a failure.

A post that never arrives points at the automation, the Page's
authorisation, or the feed.
