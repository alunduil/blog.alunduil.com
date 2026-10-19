# Set up dlvr.it

dlvr.it forwards a source feed to connected social accounts. Every
syndication guide here builds on what this page sets up:

- [Syndicate posts to Bluesky](syndicate-posts-to-bluesky.md)
- [Syndicate posts to LinkedIn](syndicate-posts-to-linkedin.md)
- [Syndicate posts to Threads](syndicate-posts-to-threads.md)
- [Syndicate releases to social](syndicate-releases-to-social.md)

Why dlvr.it rather than a self-hosted poster is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

The dlvr.it labels in these guides may shift as its interface changes;
match the intent rather than the exact wording.

## Create the account

1. Sign up at dlvr.it. One account carries every source and every
   destination, so this is a one-time step.
2. Point its notifications at an inbox you read. dlvr.it emails on feed
   and posting errors, and that email is the only thing that announces a
   post which never went out.

## Create an automation for a feed

Each feed gets one automation, and each social reading that feed is an
output on it. The blog serves three feeds for syndication:

- `https://blog.alunduil.com/rss.xml` carries every post.
- `https://blog.alunduil.com/reviews/rss.xml` carries every review.
- `https://blog.alunduil.com/linkedin.xml` carries only posts marked
  `linkedin: true`.

All three exclude future-dated posts, so nothing syndicates before its
`pubDatetime`. Each item carries two blocks of text: `description`, the
one-line hook, and `content:encoded`, the whole post.

1. Open the Automate tab and create a New Automation with the feed's URL
   as its input.
2. In the automation's Settings, under Advanced, set Body posting
   options to Prefer summary content, which picks the hook.
3. Set Image selection order to Open Graph tags first, which picks the
   post's social image over the first image in its body.

## Limit the first sync

Whenever you add a feed, cap how many existing items post before the
automation goes live. A feed arrives carrying its back catalogue, and
all of it is old news.
