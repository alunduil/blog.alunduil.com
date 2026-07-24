---
pubDatetime: 2026-07-28T07:00:00Z
title: "How to Back Up Google Takeout to TrueNAS"
description: "The mechanism behind How I Back Up—a periodic Google Takeout, one TrueNAS Cloud Sync task, and a few lines of tar and find that turn cloud-locked data into a local copy you can browse."
tags:
  - backups
  - cloud
  - truenas
---

In June I wrote up [how the household backs itself up][how-i-back-up].
That post gave the shape. A [Google Takeout][takeout] runs every two
months. A Cloud Sync job on the TrueNAS extracts and prunes it when the
new generation lands. This is the mechanism: the export, the task, and
the twenty-odd lines of shell that turn a folder of tarballs into a local
copy I can browse. You can own a durable copy of cloud-locked data
without a paid migration tool. A periodic Takeout and a little `tar` and
`find` is the whole pattern.

## The Takeout export

Takeout packages almost anything Google holds for you into a set of
archives. I start one from [Google Takeout][takeout] and pick the
products I want. On the next screen, I set the delivery to Add to Drive
and the file type to `.tgz`. That last choice matters. `tar` reads a
`.tgz` straight through, so a `.zip` export would need a different unpack
step.

Google assembles the export over the next few hours. A large account can
take most of a day. The result lands in a Takeout folder in Drive, split
into numbered tarballs when it runs big. Takeout can also schedule
itself—six exports across a year—if you would rather not start each one
by hand.

## The Cloud Sync task

On the TrueNAS side, it's a single Cloud Sync task. It pulls that Drive
folder down and hands off to a post-script. The current TrueNAS—the SCALE
line, since folded into the Community Edition—keeps these menus in
different places than the older CORE interface the task was first built
on. As it stands now:

1. Under Credentials → Backup Credentials, add a Cloud Credential, pick
   Google Drive as the provider, and log in to authorise it.
2. Under Data Protection → Cloud Sync Tasks, click Add.
3. Set Direction to PULL.
4. Set Transfer Mode to SYNC.
5. Set the Credential to the Google Drive credential from step one.
6. Set Folder to the Drive path the Takeout lands in—mine is `/Takeout`.
7. Set Directory/Files to a `tarballs/` directory inside the dataset you
   want the copy to live in.
8. Set a Schedule for how often the box checks Drive; mine runs daily at
   02:00.
9. Turn on Acknowledge Abuse. Drive flags Takeout archives—they're large
   and machine-generated—and the pull fails outright without this.
10. Turn on Fast List. It trades memory for far fewer listing calls
    against Drive.
11. Expand Advanced Options and set Post-Script to the path of
    `extract.sh`, below.
12. Save, then use Run Now once to confirm the pull and the extract both
    land where you expect.

Because the task is a SYNC, that `tarballs/` directory mirrors Drive
exactly. When I confirm a generation extracted cleanly, I delete the
Takeout from Drive. The next sync then removes the local tarball too. The
extracted copy lives in a sibling directory the sync never touches, so it
survives. The tarball was only ever the transport.

## The post-script

`extract.sh` runs after every successful pull. Most runs have nothing to
do—I usually delete the Drive copy once I've confirmed a generation, so
`tarballs/` sits empty until the next Takeout.

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

Takeout names each archive like `takeout-20260728T090000Z-001.tgz`. The
script lifts the date stamp out of the filename and groups every tarball
from one export under a single generation directory. It unpacks them
there. Then one `find` prunes any generation older than the keep window.
That window is the only real decision here. Mine keeps six months, a
hundred and eighty days. That covers three generations at a two-month
cadence—enough that one bad export never costs me the last good one.

I dropped two things from what actually runs on my box to make this
portable: a hard-coded dataset path, now the first argument, and a `tar
--exclude` for one large directory I keep in cloud storage but not
locally. Add your own excludes there if a Takeout pulls down more than you
want on the pool. The exact copy I run—those specifics still in—lives in my
infrastructure repository, [documented as a how-to][runbook] for anyone
reproducing it, me included. That's what I'd restore from, not the
generalised script above.

---

I still confirm each generation by hand before I delete the Drive copy. I
open the extracted tree and glance that it looks whole. Nothing in this
flow would tell me a tarball came down truncated or a `tar` bailed
halfway. The script trusts the pull; I'm the part that checks. The prune
trusts the clock, not the contents. If I ever stopped taking new
Takeouts, it would delete its way down to nothing. I haven't wired either
guard. I just remember to look.

[how-i-back-up]: /posts/how-i-back-up
[takeout]: https://takeout.google.com
[runbook]: https://github.com/alunduil/alunduil-infrastructure/blob/main/docs/how-to/configure-truenas-takeout-backup.md
