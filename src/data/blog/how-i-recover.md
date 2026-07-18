---
pubDatetime: 2026-07-28T08:00:00+01:00
title: "How I'd Recover a Box I Can't Reach"
description: "A Tailscale exit node backs itself up hourly, but recovering it from another continent is a paper plan; the hard part is the configuration merge, not the data."
tags:
  - disaster-recovery
  - backups
  - homelab
---

Somewhere in the American Midwest, a NanoPi-NEO3 runs one service and
nothing else. It's a [Tailscale][tailscale] exit node—the box that lets
my traffic surface on a US address when I need it to—and that's its whole
life. I built it to be forgotten. Unattended upgrades keep it patched, a
[Grafana Alloy][alloy] agent ships its metrics somewhere I can glance at
them, and for months at a stretch I don't think about it at all.

I live in London. For almost everything the box does, the ocean between
us is a detail that never comes up.

What tells me something is wrong is silence. [UptimeRobot][uptimerobot]
watches for a heartbeat on a schedule, and when the check-ins stop, it
pages me. The monitor has to run off the box: a dead box can't report its
own failure, and neither can the telemetry running on it.

Every hour, the box also backs itself up. A systemd timer fires an
[`rclone`][rclone] job that pushes three things into a corner of my
Google Drive: the list of every installed package, the whole of `/etc`,
and the whole of `/home`. Configuration, package selection, and my
files—everything a working system is made of, copied off the board and
out of the house before anything can happen to the card it lives on.

So I'm covered. The data is safe, an hour old at worst, sitting somewhere
I trust. Recovery, if it ever came to it, felt like a problem I'd already
solved.

Then the heartbeat stops. Most of the time it's nothing dramatic: a cable
has worked loose, or the switch the box hangs off has rebooted, and the
box is fine again the moment the network comes back. For all the planning
that follows, the thing that takes this box down is usually the cable, not
a corrupted SD card. And even that I can't fix from London—a loose cable
waits on someone walking over to the board.

The failures that actually need a plan are rarer: an SD card that has
quietly corrupted itself, or an upgrade that went in wrong and won't boot
again. Either way the fix is the same, and it starts with a new card.

That's the first problem, because I can't touch the card. The people I
have on-site are willing but not technical. What I can ask of them is
small and physical: take out the old card, put in one that boots, and
power the board back on. Everything after that has to come from me, over
SSH, from another continent. So the plan has to work at that distance. It
has to ask little of the hands at one end and forgive me at the other.

Even that first step isn't fully solved. Someone has to flash the card,
and the hands I have can't. The best answer I have right now is to walk
them through it on a video call, which is its own kind of fragile.

Once the box boots, most of the recovery is quick. A saved list of package
selections goes back with `dpkg --set-selections` and an `apt` pass to
pull them in. `/home` comes down from Google Drive with the same `rclone`
that put it there. Grafana Alloy isn't in Debian's archives, so it gets
reinstalled from Grafana's own repository. Nine-tenths of the box comes
back in a handful of commands, and none of it is where the risk lives.

The risk lives in the last tenth. There is a next move that suggests
itself, and it is the wrong one. My backup has the whole of `/etc`, every
configuration file the running system had, so the temptation is to
`rsync` it straight back over the fresh image and be done. That is the
failure mode.

The trap is `/etc/fstab`, the file that names which disk to mount as the
root. A freshly flashed card has a new filesystem with a new UUID, and
the base image's `fstab` already points at it. My backed-up `fstab`
points at the old card's UUID, which no longer exists. Copy it over and
the box can't find its root on the next boot. It won't come up, I won't
get an SSH prompt, and the only fix is a pair of hands in the Midwest.

Networking could strand me the same way. A wrong interface name or a
stale static address, and there is no route home. I took that failure off
the table on purpose: the box uses DHCP. Whatever the fresh image calls
its interface, it asks the network for an address and gets one, and I can
reach it. There is no network configuration to merge, because I chose not
to have any.

It gets touchier still. The card I reflash to probably won't be the same
base image the box runs now. I built the current one from the vendor's
default and upgraded it by hand, and a rebuild would likely start from a
different image. Its defaults in `/etc` will differ from mine in ways I
can't fully predict. That is one more reason a blind copy is reckless.

So the real work is smaller than it looks. The data was never the hard
part; `rclone` has all of it. The hard part is `/etc`, and on a box an
ocean away a wrong file there is not an inconvenience. It is a second
trip I have to arrange from London. The discipline comes down to almost a
single file: leave the fresh image's `fstab` alone, let DHCP keep me on
the network, copy the hostname back, and `rsync` only the application
configs that are safe to restore.

There is a hole in all of this that a clean `/etc` merge doesn't close.
The thing that lets me reach the box at all is Tailscale, and Tailscale's
identity for this node lives in `/var/lib/tailscale`, which my backup
never touches. It syncs `/etc` and `/home` and nothing else. So even a
perfect restore brings the exit node back with no idea who it is on my
network. I would have to re-authenticate it before it is an exit node
again, and before I can reach it the usual way.

The fallback is uglier than I'd like. I can talk the people on-site
through forwarding the SSH port on the router, so I connect straight to
the box over the internet with no Tailscale in the way. But that only
works if my key is already trusted by the machine I'm connecting to, and
a fresh image is exactly the machine that hasn't been told to trust it
yet. The way back in depends on the access I'm trying to restore. I don't
have a clean answer for that yet; it's the weakest link, and it's on the
list.

Every step of this is written down, and not one of it has been run. It's
a plan on paper, and I know why it stays that way. The only real test is
a real restore: wipe the card, flash it, and walk the whole sequence on
the live hardware. But the live hardware is a working exit node I depend
on, sitting where I can't get to it. To prove the recovery works I'd have
to break the thing I'm protecting, on a box I can't reach if the proof
goes wrong. The distance that makes this plan worth writing is the
distance that keeps me from testing it.

There is a better version waiting to be built. If I baked my
configuration into the image itself, so a rebuild started from a card
that already knew how to be this box, the merge would shrink toward
nothing and the job at the far end would get simpler for the people doing
it. That's the direction. I haven't built it yet.

For now I have hourly backups I trust and a recovery I've never
rehearsed. Hands-off was always the point of this box; an untested plan
for the day it isn't is the tax I pay for the quiet.

[tailscale]: https://tailscale.com/
[alloy]: https://grafana.com/docs/alloy/latest/
[uptimerobot]: https://uptimerobot.com/
[rclone]: https://rclone.org/
