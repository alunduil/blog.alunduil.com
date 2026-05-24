---
pubDatetime: 2026-06-02T07:00:00Z
title: "How I Back Up"
description: "How a TrueNAS, a Home Assistant box, and a Chromebook back themselves up—delegated to Cloud Sync, Nabu Casa, and a Google account."
tags:
  - backups
  - methodology
---

In 2011 I wrote up the [cron entry][2011] that pushed `rdiff-backup`
from my laptop. Here's what runs in its place.

## TrueNAS

A TrueNAS holds about 2.5 TiB of my household's data on a 10-TiB
pool. The biggest dataset is `takeout`—1.3 TiB accumulated from a
Google Takeout that runs every two months. When a new generation
lands in Drive, a Cloud Sync job extracts and prunes it locally; I
confirm the result and bin the Drive copy, so the daily 02:00 sync
usually has nothing to do. After that come `media` (a terabyte of
video and music), smaller `plex` and `scans` datasets, and a couple
of utility datasets I leave alone.

Cloud Sync runs six tasks on the box. The Takeout flow above is
one of them. The other five fall into two shapes. Two are sync
tasks, with the NAS as the master and Drive holding a stay-in-step
copy: `media` every six hours, `plex` every two. Three are move
tasks—a file produced at one end gets relocated to where it
permanently lives: `scans` from the NAS into Drive every fifteen
minutes, Xbox screenshots and Game DVR clips from [OneDrive] into
the NAS every fifteen minutes. Source gets emptied once the file
lands.

The sync tasks hedge against losing the NAS. The move tasks aren't
backup at all; they're routing. The files they route end up
somewhere that itself gets backed up.

Two gaps I know about. Alloy's configuration should be in the
Cloud Sync flow alongside [Plex] but isn't yet. And nothing surfaces
Cloud Sync failures to me—not my weekly [Grafana Cloud][grafana]
triage, not TrueNAS's email alerts. I notice eventually, when
something I expected to be there isn't.

## Home Assistant

[Home Assistant][ha] runs as HAOS on a mini PC—dedicated hardware
for a single service, which is bulky but uncomplicated.
[Nabu Casa] does the backups: daily, plus an automatic one before
every version update. Destination, transport, and retention all
come bundled with the subscription; [their docs][nabu-backups]
cover the specifics.

## Chromebook

Recovery for the Chromebook is signing back into a Google account.
The one exception is the Linux dev environment, where anything I
edit locally lives. I used to dump it into Google Drive monthly;
that cadence has been lapsing on purpose as I move my Linux
configuration into [chezmoi] under [alunduil-chezmoi]. A clean DR
run from chezmoi should restore the environment from scratch.
Confirming that works is on the list.

My phone and an [Onyx Boox Tab Ultra C][boox] both sign in to the
same Google account. None of the devices lock me in; the account
does. The hardware stays replaceable; the substrate underneath
doesn't.

---

Cloud-first by choice, because doing otherwise would cost more
time than I'm willing to spend. The disaster plan: if a cloud
vendor stops working, what I'd restore from, in what order, from
which local copy. I haven't tested it.

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
