# Syndication is not blog-only

The dlvr.it account behind this site began as a forwarder for one feed,
the blog's. It now carries several, and that shift changes what the blog
is for.

## Project news is canonical on GitHub

A release announcement is timely, low-context, and already written as
part of releasing. Putting it on the blog as well would mean keeping the
same sentence accurate in two places, and a reader who followed the link
would find nothing the release page had not already told them.

So project release news stays canonical on GitHub, and its syndicated
posts link there rather than to the blog. This is still POSSE. The
pattern asks that syndicated copies point back at an origin the author
controls; it does not ask that every origin be the same site. GitHub is
the own-site for project news, the blog for everything else.

The trade is worth naming. GitHub is a platform rather than
self-hosted infrastructure, so this leans on it in a way the blog does
not. Release notes live in the repository and would survive GitHub
going away; the rendered release pages, and the feed built from them,
would not.

## One account, several sources

dlvr.it keeps sources and destinations apart. Sources are feeds,
destinations are connected social accounts, and a route joins one of
each. Several sources can share a destination.

That sharing is what makes a new project cheap to add. Its feed reaches
socials that are already connected and authorised, so nothing needs
re-authorising.

It also decides what a route costs, because the two allowances are
counted separately: a source counts against the plan's feed allowance, a
destination against its social profile allowance. Adding a feed is
therefore far cheaper than adding a platform—which is why the
syndication strategy treats a new platform as a decision worth an ADR
and a new project feed as routine.

What does accumulate is posting volume. Each social profile caps how
many posts it accepts in a rolling day, and every feed routed to it
draws on that one cap. Projects releasing together compete with each
other, and with the blog.
