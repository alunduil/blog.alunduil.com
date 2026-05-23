---
pubDatetime: 2026-06-02T07:00:00Z
title: "How I Back Up"
description: "Six Cloud Sync tasks, a Nabu Casa subscription, and a Google account: the actual shape of my backups in 2026."
tags:
  - backups
  - methodology
---

In 2011 I wrote up the [cron entry][2011] that pushed `rdiff-backup`
from my laptop. Here's what runs in its place.

## TrueNAS

A TrueNAS holds about 2.5 TiB of my household's data on a 10-TiB
pool. The biggest dataset is `takeout`—1.3 TiB of Google
Takeout pulled down on a daily 02:00 cadence, so the cloud data I
care about most has a local mirror I can fall back on. After that
come `media` (a terabyte of video and music), smaller `plex` and
`scans` datasets, and a couple of utility datasets I leave alone.

Backups all run as Cloud Sync tasks, six of them on different
cadences. Three push my data out for durability: `media` every six
hours, `plex` every two, `scans` every fifteen minutes (since the
flow is scan, drop, walk away). Three pull data home for custody:
Takeout from Google Drive nightly, and Xbox screenshots and game
DVR clips from [OneDrive] every fifteen minutes—same idea as
Takeout, just for the cloud Microsoft makes me use.

The asymmetry is the shape. My data pushes out so it survives a NAS
failure. Data that's only ever in someone else's cloud pulls down
so it survives a vendor decision.

[Plex] is the only application I treat as a service rather than
data; its app data rides in the same Cloud Sync flow as
everything else.

I haven't wired any of these to a loud alert. [Netdata] watches the
box and [Scrutiny] watches the disks, but Cloud Sync failures
aren't on either dashboard. That's the gap I know I have and
haven't closed.

## Home Assistant

[Home Assistant][ha] runs as HAOS on a mini PC—dedicated hardware
for a single service, which is bulky but uncomplicated.
[Nabu Casa] does the backups: daily, plus an automatic one before
every version update. Destination, transport, and retention all
come bundled with the subscription; [their docs][nabu-backups]
cover the specifics.

The integration cost was selecting the plan. That's the entire
backup story for this machine.

## Chromebook

I'm typing this on a Chromebook. Browser state lives in my Google
account by default. The Linux dev environment, where anything I
edit locally lives, I used to dump into Google Drive once a month.
That cadence has been lapsing on purpose: I'm moving my Linux
configuration into [chezmoi] under [alunduil-chezmoi], and the
plan is that a clean DR run from chezmoi should restore the
environment from scratch. Confirming that works is on the list.

My phone and an [Onyx Boox Tab Ultra C][boox] both sign in to the
same Google account. None of the devices lock me in; the account
does. The hardware stays replaceable; the substrate underneath
doesn't.

## What I'm signing up for

Cloud-first by choice, because doing otherwise would cost more
time than I'm willing to spend. Not a tight recovery plan—no
measured RPO, no measured RTO, no rehearsal cadence. What I do
have is a disaster plan: if a cloud vendor stops working, what I'd
restore from, in what order, from which local copy. That's the
architecture. Everything above is the implementation.

[2011]: /posts/using-rdiff-backup-backup-remote-clients-with-ease
[OneDrive]: https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage
[Plex]: https://www.plex.tv/
[Netdata]: https://www.netdata.cloud/
[Scrutiny]: https://github.com/AnalogJ/scrutiny
[ha]: https://www.home-assistant.io/
[Nabu Casa]: https://www.nabucasa.com/
[nabu-backups]: https://www.home-assistant.io/integrations/cloud/#backups
[chezmoi]: https://www.chezmoi.io/
[alunduil-chezmoi]: https://github.com/alunduil/alunduil-chezmoi
[boox]: https://onyxboox.com/boox_taburtrac
