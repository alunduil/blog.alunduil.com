---
pubDatetime: 2026-07-28T07:00:00Z
title: "How to Back Up Google Takeout to TrueNAS"
description: "One TrueNAS Cloud Sync task and a short extract-and-prune script that keep a local copy of your Google data from a periodic Takeout."
tags:
  - backups
  - cloud
  - truenas
---

[How I Back Up][how-i-back-up] sketches this backup; here's the recipe. You
need a TrueNAS and a Google account.

## The Takeout export

1. Start a [Google Takeout][takeout] and pick your products.
2. On the delivery screen, set delivery to Add to Drive and file type to
   `.tgz`—`tar` unpacks `.tgz` directly, where a `.zip` needs another step.
3. Start the export, optionally scheduling six a year. It lands in a
   `Takeout` folder in Drive as numbered tarballs.

## The Cloud Sync task

The [Cloud Sync Tasks reference][truenas-cloudsync] lists every field;
these are the ones this recipe sets, in the current SCALE menus:

1. Under Credentials → Backup Credentials, add a Cloud Credential for
   Google Drive and [log in to authorise it][truenas-gdrive].
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
12. Once a generation extracts cleanly, delete the export from Drive. The
    next sync clears the local tarball; the extracted copy sits in a
    sibling directory the sync never touches, so it stays.

## The post-script

Point step 10's Post-Script at `extract.sh`, passing your dataset path and
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

Mine keeps 180 days—three generations at a two-month cadence, so one bad
export never costs the last good one. The exact copy I run, with a personal
`tar --exclude` re-added, is [documented as a how-to][runbook].

---

Two gaps: nothing here catches a truncated download, so I check each
extracted tree before deleting the Drive copy; and the prune trusts the
clock, so if exports stopped it would delete down to nothing.

[how-i-back-up]: /posts/how-i-back-up
[takeout]: https://takeout.google.com
[runbook]: https://github.com/alunduil/alunduil-infrastructure/blob/main/docs/how-to/configure-truenas-takeout-backup.md
[truenas-cloudsync]: https://www.truenas.com/docs/scale/dataprotection/cloudsynctasks/
[truenas-gdrive]: https://www.truenas.com/docs/scale/dataprotection/cloudsynctasks/cloudsynctaskgoogledrive/
