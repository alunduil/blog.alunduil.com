---
pubDatetime: 2026-06-02T07:00:00Z
title: "How I Back Up"
description: "How a TrueNAS, a Home Assistant box, and a Chromebook back themselves up—delegated to Cloud Sync, Nabu Casa, and a Google account."
tags:
  - backups
  - methodology
  - cloud
shape: practice
---

In 2011 I wrote up the [cron entry][2011] that pushed `rdiff-backup`
from my laptop. Here's what runs in its place.

## TrueNAS

A TrueNAS holds about 2.5 TiB of my household's data on a 10-TiB
pool. The biggest dataset is `takeout`, 1.3 TiB built up from a
Google Takeout that runs every two months. When a new generation
lands in Drive, a Cloud Sync job pulls it out and prunes it on the
box. I check the result and bin the Drive copy, so the daily 02:00
sync tends to have nothing left to do. After that come `media` (a
terabyte of video and music), the smaller `plex` and `scans`
datasets, and a couple of utility datasets I leave alone.

Cloud Sync runs six tasks on the box, and the Takeout flow above is
one of them. The other five fall into two shapes. Two are sync
tasks, where the NAS leads and Drive keeps a copy in step: `media`
every six hours, `plex` every two. Three are move tasks, taking a
file made at one end and sending it where it will live for good.
`scans` goes from the NAS into Drive every fifteen minutes. Xbox
screenshots and Game DVR clips come from [OneDrive] into the NAS on
the same clock. The source is emptied once the file lands.

The sync tasks hedge against losing the NAS. The move tasks aren't
backup at all. They're routing, and the files they route end up
somewhere that does get backed up.

Two gaps I know about. Alloy's configuration belongs in Cloud Sync
next to [Plex], and it isn't there yet. Nothing tells me when a
Cloud Sync task fails, either—not my weekly [Grafana Cloud][grafana]
triage, not TrueNAS's email alerts. I find out late, when something
I expected to be there isn't.

## Home Assistant

[Home Assistant][ha] runs as HAOS on a mini PC, a whole box given
over to one service, which is bulky but uncomplicated. [Nabu Casa]
does the backups: one a day, plus one before every update. Where
they go, how they get there, and how long they're kept all come
with the plan, and [their docs][nabu-backups] cover the rest.

## Chromebook

To get the Chromebook back I sign into a Google account. The one
exception is the Linux dev environment, where anything I edit
locally lives. I used to dump it into Google Drive once a month,
and I've let that slip on purpose while I move my Linux setup
into [chezmoi] under [alunduil-chezmoi]. A clean run from chezmoi
should restore the environment from scratch. Proving that it does
is on the list.

My phone and an [Onyx Boox Tab Ultra C][boox] both sign in to the
same Google account. None of the devices lock me in. The account
does. The hardware stays replaceable. The substrate underneath
doesn't.

---

Cloud-first by choice, because doing it any other way would cost
more time than I want to spend. The disaster plan: if a cloud
vendor stops working, what I'd rebuild from, in what order, and
from which local copy. I haven't tested it.

[2011]: /posts/using-rdiff-backup-backup-remote-clients-with-ease
[OneDrive]: https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage
[Plex]: https://www.plex.tv/
[grafana]: https://grafana.com/products/cloud/
[ha]: https://www.home-assistant.io/
[Nabu Casa]: https://www.nabucasa.com/
[nabu-backups]: https://www.home-assistant.io/integrations/cloud/
[chezmoi]: https://www.chezmoi.io/
[alunduil-chezmoi]: https://github.com/alunduil/alunduil-chezmoi
[boox]: https://onyxboox.com/boox_tabultrac
