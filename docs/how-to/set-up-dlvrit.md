# Set up dlvr.it

dlvr.it forwards a source feed to connected social accounts. Every
syndication guide here assumes the account this page creates, and
follows the habits it sets out, so each one covers only what its own
feed and destination need:

- [Syndicate posts to Bluesky](syndicate-posts-to-bluesky.md)
- [Syndicate posts to Threads](syndicate-posts-to-threads.md)
- [Syndicate releases to social](syndicate-releases-to-social.md)

Why dlvr.it rather than a self-hosted poster is recorded in
[ADR 0001](../adr/0001-use-dlvrit-for-social-syndication.md).

The dlvr.it labels in these guides may shift as its interface changes;
match the intent rather than the exact wording.

## Create the account

Sign up at dlvr.it. One account carries every source and every
destination, so this is a one-time step—later guides add to it rather
than repeating it.

Before adding anything, check the plan has room. A source counts against
the feed allowance and a destination against the social profile
allowance, and the two are counted separately, so a new feed routed to
socials already connected needs no new profile.

## Learn the two halves of a route

Sources live under the Feeds tab, destinations under the Socials tab. A
route joins one of each, and dlvr.it posts an item when it turns up in
the feed. Several sources can share one destination, which is what lets
a second feed reach socials that are already connected and authorised.

## Limit the first sync

Whenever you add a feed, cap how many existing items post before the
route goes live. A feed arrives carrying its back catalogue, and all of
it is old news. Posting only new items from here on is the goal.

## Notice when it breaks

Syndication breaks quietly—nothing announces the post that never went
out. Two layers cover it.

- dlvr.it emails on feed or posting errors and shows route health on its
  dashboard. Keep those emails reaching an inbox you read.
- Periodically, and after publishing or releasing, confirm the newest
  item reached each connected social. A missing post is the signal that
  the route, the credential, or the feed has stopped working.

Each guide names the check specific to its own route.

If the pipeline needs replacing, nothing in this repository depends on
dlvr.it. ADR 0001 records the alternatives weighed and the triggers for
revisiting the choice.
