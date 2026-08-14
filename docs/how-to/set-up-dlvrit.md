# Set up dlvr.it

dlvr.it forwards a source feed to connected social accounts. Every
syndication guide here builds on the account this page creates:

- [Syndicate posts to Bluesky](syndicate-posts-to-bluesky.md)
- [Syndicate posts to Threads](syndicate-posts-to-threads.md)
- [Syndicate releases to social](syndicate-releases-to-social.md)

Why dlvr.it rather than a self-hosted poster is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

The dlvr.it labels in these guides may shift as its interface changes;
match the intent rather than the exact wording.

## Create the account

Sign up at dlvr.it. One account carries every source and every
destination, so this is a one-time step.

Sources live under the Feeds tab and destinations under the Socials tab;
a route joins one of each. Several sources can share a destination,
which is what lets a new feed reach socials that are already connected
and authorised. It also sets what a route costs: a source counts against
the feed allowance and a destination against the social profile
allowance, and the two count separately.

## Limit the first sync

Whenever you add a feed, cap how many existing items post before the
route goes live. A feed arrives carrying its back catalogue, and all of
it is old news.

## Notice when it breaks

Syndication breaks quietly—nothing announces the post that never went
out. Two layers cover it.

- dlvr.it emails on feed or posting errors and shows route health on its
  dashboard. Keep those emails reaching an inbox you read.
- Periodically, and after publishing or releasing, confirm the newest
  item reached each connected social. A missing post is the signal that
  the route, the credential, or the feed has stopped working.

If the pipeline needs replacing, nothing in this repository depends on
dlvr.it. ADR 0001 records the alternatives and the triggers for
revisiting the choice.
