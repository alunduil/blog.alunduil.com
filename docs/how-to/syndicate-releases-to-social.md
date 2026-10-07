# Syndicate releases to social

This guide wires a project's GitHub releases feed to dlvr.it, so cutting
a release announces it on the connected socials with no manual step. The
posts link back to the release page on GitHub, not to the blog.

## Before you start

- A dlvr.it account with its socials connected, per
  [Set up dlvr.it](set-up-dlvrit.md).
- The project's releases feed. GitHub publishes one for every public
  repository at `https://github.com/<owner>/<repo>/releases.atom`, with
  no setting to enable.

## Add the releases feed

1. Open the Automate tab and create a New Automation with the feed URL
   as its input, for example
   `https://github.com/alunduil/zfs-replicate/releases.atom`.
2. Add the same outputs the blog's automation already posts to.
3. Limit the first sync. The feed arrives holding past releases, and
   every one of them is old news.

## Post the title and link, not the release notes

Each entry carries the tag as its title, a link to the release page, and
the whole rendered release notes, with no short summary alongside them.
Unlike the blog's feed, this one offers no choice of length, so an
output posting the item body posts the notes in full.

Keep each output's Post body toggle off, so the message is the title
and link. In the automation's Settings, under Item text, set Begin
posts with to the project name—the tag alone identifies nothing to a
reader scrolling past. A finished post reads:

```text
zfs-replicate v4.1.0
https://github.com/alunduil/zfs-replicate/releases/tag/v4.1.0
```

## Verify

1. Cut a release, or trigger a manual feed check.
2. Confirm a post appears on each connected social, pointing at the
   release page rather than at the blog.

dlvr.it checks the feed on a schedule rather than on release, so a
release appears at the next check—a short delay is not a failure.

## Add another project

Every public repository publishes the same `releases.atom`, so a second
project needs a second automation, posting to the same outputs, with
its own name in front of the tag. If a release goes missing on a day
several projects shipped, check the profile's posting cap first.
