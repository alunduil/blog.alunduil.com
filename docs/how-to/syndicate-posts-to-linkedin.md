# Syndicate posts to LinkedIn

This guide wires the blog's LinkedIn feed to LinkedIn through dlvr.it, so
a published post marked `linkedin: true` reaches LinkedIn with no manual
step. The reasoning behind the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md). Which
posts to mark is in the
[post frontmatter reference](../reference/post-frontmatter.md#linkedin).

## Before you start

- A LinkedIn account to post to.
- A dlvr.it account with room for another social profile, per
  [Set up dlvr.it](set-up-dlvrit.md).

## Connect LinkedIn to dlvr.it

1. Sign in to dlvr.it and open the Outputs tab.
2. Add LinkedIn as an output and complete the LinkedIn authorisation.
   This grants dlvr.it permission to post to the account and nothing
   more, and you can revoke it later from LinkedIn's data privacy
   settings.

## Add LinkedIn to its own automation

LinkedIn takes only the marked posts, so its output sits on the
`linkedin.xml` automation alone. `rss.xml` carries the marked posts too,
so a LinkedIn output there would post them twice.

1. Create an automation for `https://blog.alunduil.com/linkedin.xml`,
   per [Set up dlvr.it](set-up-dlvrit.md#create-an-automation-for-a-feed).
2. Choose Add Output and pick the connected LinkedIn output.
3. Limit the first sync, so the marked back catalogue does not post at
   once.

## Post a public shared link

A shared link renders as a card built from the post's Open Graph tags:
title, one-line hook, and social image.

1. Open the LinkedIn output from the Outputs tab and choose Edit.
2. Under Post options, set Post style to Shared link, and leave Begin
   posts with and End posts with empty.
3. Under Advanced, set Post privacy to Public, so the post reaches
   readers outside your connections and signed-out visitors.

## Verify

1. Trigger a manual check, or wait for the next marked post to publish.
2. Confirm a LinkedIn post appears with a link card, and follow the link
   to confirm it lands on the canonical URL.

dlvr.it checks the feed on a schedule rather than on publish, so a new
post appears at the next check—a short delay is not a failure.

A post that never arrives points at the automation, the LinkedIn
authorisation, or the feed.
