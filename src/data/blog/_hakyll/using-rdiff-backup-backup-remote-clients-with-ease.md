---
pubDatetime: 2011-02-03T14:00:00Z
title: "Using rdiff-backup: Backup Remote Clients With Ease"
description: "A cron-driven rdiff-backup recipe that pushes incremental backups over SSH from a NAT'd client to a remote server, wrapping the SSH call through --remote-schema."
tags:
  - backups
  - rdiff-backup
shape: how-to
timezone: America/Chicago
hideEditPost: true
---

> **Archival republish.** From this blog's Hakyll era; lightly copyedited.

## Introduction

Backups are awesome! Unless you don't have any. Also, it's hard to find
space for them and setting them up isn't always fun. Without backups the
day will come when we lose data and need to get it back and can't. Whether
it's an accidental delete of the project you've been working hard on; a
disk issue resulting in partial or complete data loss; or something
completely different, data loss is only a matter of when, not if.

## The Problem

Backing up clients behind NAT and other network obfuscation techniques
adds another set of challenges to the equation. These can be solved by
initiating them client side and having management set up around the idea
of a data dump.

## The Solution

[rdiff-backup](https://rdiff-backup.net/) allows us to initiate
backups from the client, use SSH as the communication protocol, keep
incremental backups, &c.

Automating backups with rdiff-backup isn't overly challenging but isn't
outlined (with required nuances). The magic lies in a little-known
option, `--remote-schema`.

For example, the following Bash snippet is the cron entry (could be moved
to a proper script) that backs up my laptop to a remote site (split
across lines for readability):

```bash
/usr/bin/rdiff-backup \
--remote-schema 'ssh -i /home/alunduil/.ssh/backup_dsa %s rdiff-backup --server' \
--exclude-other-filesystems \
--print-statistics \
/home/alunduil \
daneel.alunduil.com::elijah-backup && \
/usr/bin/rdiff-backup \
--remote-schema 'ssh -i /home/alunduil/.ssh/backup_dsa %s rdiff-backup --server' \
--remove-older-than 7D \
--force \
daneel.alunduil.com::elijah-backup
```

Breaking this down, we have a few things that require explanation:

- **`/usr/bin/rdiff-backup`** — the rdiff-backup script.
- **`--remote-schema`** — the magic! This specifies the way that SSH is
  called by rdiff-backup, allowing particular control over the SSH tunnel
  used to communicate with the server.
- **`--exclude-other-filesystems`** — don't cross filesystem boundaries
  when finding files to back up.
- **`--print-statistics`** — print a nice report of the files uploaded,
  &c when finished.
- **`/home/alunduil`** — the local directory to back up.
- **`daneel.alunduil.com::elijah-backup`** — the remote host and
  directory to backup into.
- **`--remove-older-than`** — remove any backups older than the time
  passed.
- **`--force`** — force the action even if warnings might occur.

## Conclusion

Creating backup strategies for remote clients with rdiff-backup is quite
easy. This solution is ideal for mobile and spottily connected clients
like laptop machines that might not be able to phone home for a variety
of reasons.
