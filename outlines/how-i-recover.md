# How I'd Recover a Box I Can't Reach — outline

*Working title.* Companion to [How I Back Up]. Register: "How I…"
methodology prose, NanoPi as the worked example, pattern generalizes to
any remote pet Linux host.

**Logline.** The one moment of change: realizing the hard part of
recovering a remote single-board host isn't the data — `rclone` already
has that — it's that a wrong `/etc` restore over SSH locks me out of a
box on another continent, with only lay hands on-site and no way back
in. The story opens at its opposite: a dead-simple, hands-off Tailscale
exit node that just works and backs itself up every hour, so recovery
*feels* solved. It lands on the honest limit — the plan stays untested,
because the only way to test it is to risk bricking the working box I
can't touch. The distance that makes the plan necessary is the same
distance that forbids me from running it.

Facts in hand: NanoPi-NEO3, Debian 12 (bookworm), single job = Tailscale
exit node in the US Midwest; author in London; lay hands available
on-site for physical steps only. Backup is real —
`rclone-backup.service` + `.timer` (`OnCalendar=hourly`,
`Persistent=true`), syncing package selections, all of `/etc`, and all
of `/home` to `Google Drive:NanoPi-NEO3/`. Restore is a paper plan,
never executed.

## 1. The box that just works — *the opposite*

1. NanoPi-NEO3: one job, a Tailscale exit node — nothing else *(single purpose)*
2. It lives in the US Midwest; I live in London *(the distance, planted but not yet the problem)*
3. Built for hands-off: autoupdates and Grafana Alloy telemetry so I never think about it
4. A UptimeRobot heartbeat is the outage alarm — the box checks in, and its silence is the signal, because a dead box (and its telemetry) can't report itself *(HEARTBEAT monitor "NanoPi-NEO3")*
5. It backs itself up every hour to Google Drive — package selections, `/etc`, `/home` *(`rclone-backup.service` + `.timer`, `OnCalendar=hourly`, `Persistent=true`; `dpkg --get-selections` + three `rclone sync` to `Google Drive:NanoPi-NEO3/`)*
6. So I'm covered. The data is safe. Recovery feels like a solved problem.

## 2. Reflash from another continent — *the complication*

1. It goes quiet — the heartbeat stops. SD-card corruption or an OS upgrade gone wrong *(the alarm from 1.4 firing is how recovery ever comes up)*
2. Either one means reflash — and I cannot touch the card *(no physical access)*
3. I have hands on-site, but lay ones: their whole job is insert a freshly-flashed card and power it on — so the plan has to be that simple for them *(design constraint)*
4. Everything after boot is mine over SSH — and the easy 90% comes back in a few commands: packages via `dpkg --set-selections` + `apt dselect-upgrade`, `/home` via `rclone`, Alloy reinstalled from Grafana's repo
5. Every one of those runs on a box that will drop me the moment I get boot or networking wrong

## 3. The file that locks the door — *the turn*

1. The tempting move: `rsync` the backed-up `/etc` straight over the fresh image — and that's the failure mode
2. Wrong root `fstab` UUID → it won't boot → no SSH → box gone *(new card = new filesystem UUID)*
3. Networking could strand me the same way — except I run DHCP precisely so a fresh image gets a route home with nothing to merge *(a lockout risk designed out)*
4. And the fresh image won't even be the same base as what's running now, so its `/etc` defaults differ further — more reason not to blind-copy *(reflash lands on a different base than the current upgraded one)*
5. On a box across an ocean, a break like that isn't an inconvenience; it's unrecoverable without another on-site trip
6. The data was never the hard part. The `/etc` merge is — and remoteness makes it unforgiving
7. So the discipline shrinks to almost one file: leave the fresh `fstab` and (thanks to DHCP) the network untouched, restore the hostname, `rsync` only the "safe" application configs

## 4. The access I didn't back up — *the twist / deepen*

1. Even a clean merge leaves one thing out: the substrate that gives me remote access at all
2. The backup syncs `/etc` and `/home` — not `/var/lib/tailscale`, so the exit node comes back with no identity *(Tailscale state isn't captured)*
3. My fallback is to walk the lay hands through forwarding the SSH port so I can connect directly — but that only works if my key is already trusted by the box, which a reflash wipes *(the catch-22)*
4. So regaining access is its own bootstrapping problem, and right now the weakest link — a gap I know about, on the list

## 5. The plan I won't run — *the landing / honest limitation*

1. All of this is written down; none of it is tested *(paper plan — same admission as How I Back Up)*
2. The only real test is a real restore, and that risks bricking a working box I can't reach
3. The distance that makes the plan worth writing is the distance that makes me refuse to run it
4. The better fix is future work: bake my config into a recovery image so a reflash lands closer to turnkey — smaller merge, simpler for the hands on-site *(on the list)*
5. Hands-off operation was the goal; an untested recovery plan is the tax I pay for it

[How I Back Up]: /posts/how-i-back-up
