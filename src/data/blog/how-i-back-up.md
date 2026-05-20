---
pubDatetime: 2026-06-02T07:00:00Z
title: "How I Back Up"
description: "The 2011 architecture for backing up NAT'd hosts survived. I no longer assemble it; appliances do. What I gave up to delegate."
tags:
  - backups
  - methodology
draft: true
---

In 2011 I [posted a cron entry][2011] that pushed `rdiff-backup` over
SSH from a NAT'd laptop to a remote backup host. The architecture was
right. The cron entry is gone—along with the laptop and the backup
host. The architecture is still running on every machine I own. I no
longer assemble it.

My current stack runs three vehicles, each delegating a different
piece. [TrueNAS] handles its own data with [rclone] on a built-in
schedule, pushing encrypted bundles to cloud object storage. [Home
Assistant] snapshots itself to [Nabu Casa]: I bought the subscription
and the rest happened. The laptop is a [Chromebook], which side-steps
laptop backups entirely—anything that matters is already in a
Google account.

All three follow the 2011 shape. Each client initiates its own backup
push; the destination is somewhere on the public internet, reached
over an outbound connection. None of them need a stable inbound
address, a public hostname, or an open port. The reasons that drove
the 2011 post haven't changed: NAT is still everywhere, hosts still
sleep, overlay networks are still optional. What changed is who
writes the SSH key, who picks the tool, and who keeps the destination
alive.

In 2011 I wrote those parts. I picked rdiff-backup; I wrote the
`--remote-schema` invocation by hand; I ran a backup host called
`daneel.alunduil.com` whose only job was to accept `rdiff-backup
--server` over SSH. The cron entry was mine. The retention window
was mine. The destination availability was mine. If the backup host
filled up I noticed because I was reading my own statistics emails.

The current vehicles run the same shape with the assembly moved into
the appliance. TrueNAS ships rclone targets as a configuration panel;
schedule, retention, and credentials live in the same UI as the pool
layout. Nabu Casa is the destination, the transport, and the
retention rolled together—selecting the subscription was the
integration step. ChromeOS is more extreme: backup isn't a feature,
because the system is built so the state lives in Google's hands by
default.

This isn't a tool-migration story. I didn't move from rdiff-backup to
borg or restic; I moved from "assembling a backup" to "running an
appliance that backs itself up." The architectural insight from 2011
held. The job changed.

What I gave up by delegating is visibility. TrueNAS nags loudly when
rclone fails, so that one I trust about as much as I trusted my own
statistics emails. Nabu Casa is quieter—I'd notice the service
going down but not a silent retention shrink. ChromeOS I can't inspect
at all; I'm assuming Google considers the things I'd consider
durable.

In 2011 I assembled every link in the chain. In 2026 I assemble none
of them. The architectural claim held, but the part of it I wrote
about—picking a tool, writing the invocation, running the
destination—isn't where the work lives any more. What's left for
me to do is choose a vendor.

[2011]: /posts/using-rdiff-backup-backup-remote-clients-with-ease
[TrueNAS]: https://www.truenas.com/
[rclone]: https://rclone.org/
[Home Assistant]: https://www.home-assistant.io/
[Nabu Casa]: https://www.nabucasa.com/
[Chromebook]: https://www.google.com/chromebook/
