# Syndicate project releases

This guide wires a project's GitHub releases feed to dlvr.it, so cutting
a release announces it on the connected socials with no manual step. The
reasoning behind the mechanism is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

The blog is not in this path. A release announcement is timely,
low-context, and already written as part of releasing—repeating a
release note as a post adds a second place to keep it accurate. So the
canonical source here is the GitHub release page, and each syndicated
post links back to it. That still follows POSSE: GitHub is the own-site
for project news, the way the blog is for everything else.

## Before you start

- A dlvr.it account with its socials connected, per
  [Set up dlvr.it](set-up-dlvrit.md). This adds a source, not a
  destination, so the socials need no further authorisation.
- The project's releases feed. GitHub publishes one for every public
  repository at `https://github.com/<owner>/<repo>/releases.atom`, with
  no setting to enable. It carries the ten most recent releases, each
  entry holding the tag as its title, a link to the release page, and
  the rendered release notes.

## Add the releases feed

1. Open the Feeds tab and add the URL, for example
   `https://github.com/alunduil/zfs-replicate/releases.atom`.
2. Route the feed to the same socials the blog's feed already posts to.
3. Limit the first sync. The feed arrives holding ten past releases, and
   every one of them is old news.

## Post the title and link, not the release notes

Unlike the blog's feed, these entries offer no choice of length: each
one carries the whole rendered release notes and no short summary
alongside them. A route that posts the item body sends every line of
them, cut off wherever the platform's character limit falls.

Set the route to build its message from the title and link instead. The
tag alone identifies nothing to a reader scrolling past, so put the
project name in front of it. A finished post reads:

```text
zfs-replicate v4.1.0
https://github.com/alunduil/zfs-replicate/releases/tag/v4.1.0
```

## Verify

1. Cut a release, or trigger a manual feed check.
2. Confirm a post appears on each connected social, pointing at the
   release page rather than at the blog.

Feed checks are periodic, so a release can take some time to appear—a
short delay is not a failure.

## Notice when it breaks

After cutting a release, confirm it reached the socials. A missing post
is the signal that the route or the feed has stopped working. The
standing alerts that catch the rest are in
[Set up dlvr.it](set-up-dlvrit.md#notice-when-it-breaks).

## Add another project

The steps generalise: every public repository publishes the same
`releases.atom`, so a second project needs a second feed, routed to the
same socials, with the same title-and-link template and its own name in
front of the tag.

Watch the posting budget as projects accumulate. Each social profile
caps how many posts it accepts in a rolling day, and every feed routed
to that profile draws on the same cap—several projects releasing
together compete with each other and with the blog. If releases start
going missing on a busy day, that cap is the first thing to check.
