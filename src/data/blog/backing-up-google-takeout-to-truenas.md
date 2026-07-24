---
pubDatetime: 2026-07-28T07:00:00Z
title: "How to Back Up Google Takeout to TrueNAS"
description: "One TrueNAS Cloud Sync task and a short extract-and-prune script that keep a local copy of your Google data from a periodic Takeout."
tags:
  - backups
  - cloud
  - truenas
---

[How I Back Up][how-i-back-up] sketches this; here's how to build it. You
need a TrueNAS and a Google account. A [Google Takeout][takeout] exports
your data to Drive as tarballs, a Cloud Sync task pulls each export down,
and a post-script unpacks it and prunes old copies. Set it up in that
order.

## The Takeout export

Start a [Google Takeout][takeout] and pick your products. On the delivery
screen, choose Add to Drive and file type `.tgz`—`tar` reads `.tgz`
directly, where a `.zip` would need a different unpack step. Export once by
hand, or let Takeout schedule six exports a year.

Google takes a few hours to assemble it, up to a day for a large account.
It lands in a `Takeout` folder in Drive, split into numbered tarballs when
it runs big.

## The Cloud Sync task

The current TrueNAS (the SCALE line) puts these menus in different places
than the older CORE layout:

1. Under Credentials → Backup Credentials, add a Cloud Credential for
   Google Drive and log in to authorise it.
2. Under Data Protection → Cloud Sync Tasks, click Add.
3. Set Direction to PULL and Transfer Mode to SYNC.
4. Set Credential to the one from step 1.
5. Set Folder to the Drive path Takeout lands in—mine is `/Takeout`.
6. Set Directory/Files to a `tarballs/` directory in the dataset you want
   the copy to live in.
7. Set a Schedule; mine runs daily at 02:00.
8. Turn on Acknowledge Abuse, or Drive blocks the large machine-generated
   archives and the pull fails.
9. Turn on Fast List—fewer listing calls against Drive, at some memory.
10. Under Advanced Options, set Post-Script to `extract.sh`, below.
11. Save, then Run Now once to confirm the pull and the extract land where
    you expect.

Because it's a SYNC, `tarballs/` mirrors Drive: once you delete a confirmed
export from Drive, the next sync drops the local tarball too. The extracted
copy sits in a sibling directory the sync never touches, so it stays.

## The post-script

Point the task's Post-Script at `extract.sh` and pass your dataset path and
keep window as its two arguments:

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

# Dataset holding the pulled tarballs/ and the extracted generations.
# Pass it as the first argument, or edit this default.
TAKEOUT_DIR="${1:-/mnt/pool/takeout}"

# Keep generations newer than this many days; prune the rest.
KEEP_DAYS="${2:-180}"

extract_generation() {
  local tarball="$1"

  # takeout-20260728T090000Z-001.tgz -> generation "20260728T090000Z"
  local generation
  generation="$(basename "$tarball")"
  generation="${generation#*-}"
  generation="${generation%%-*}"

  mkdir -p "${TAKEOUT_DIR}/${generation}"
  tar -xf "$tarball" -C "${TAKEOUT_DIR}/${generation}"
}

for tarball in "${TAKEOUT_DIR}"/tarballs/*.tgz; do
  extract_generation "$tarball"
done

find "$TAKEOUT_DIR" -mindepth 1 -maxdepth 1 -type d -not -name tarballs \
  -mtime "+${KEEP_DAYS}" -execdir rm -rf {} +
```

The keep window is the one thing to decide. Mine is 180 days—three
generations at a two-month cadence, so one bad export never costs the last
good one.

I generalised this from what runs on my box: the dataset path became the
first argument, and a personal `tar --exclude` came out. The exact copy,
[documented as a how-to][runbook], is what I'd restore from.

---

Two gaps to know about: nothing here catches a truncated download, so I
still open each extracted tree and check it before deleting the Drive copy;
and the prune trusts the clock, not the contents, so if exports ever
stopped it would delete its way down to nothing.

[how-i-back-up]: /posts/how-i-back-up
[takeout]: https://takeout.google.com
[runbook]: https://github.com/alunduil/alunduil-infrastructure/blob/main/docs/how-to/configure-truenas-takeout-backup.md
