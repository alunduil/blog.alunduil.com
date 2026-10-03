---
pubDatetime: 2026-10-13T07:00:00Z
title: Justify or Remove
description: "Provisional: chosen from the finished body."
tags:
  - agentic-coding
---

In April I moved my work to Claude and [rebuilt my tooling around
it][off-the-desk]. I kept hitting its session usage limit, which resets
every five hours. So I went looking for ways to keep the work going without
running out before the five hours were up.

I ran those sessions from [claustre], a terminal dashboard for working
across several projects at once. It came with rtk support turned on. On a
machine without rtk, the top of the screen read `rtk not installed — press
c to configure`. On the twenty-seventh of April I turned that off in its
settings. The warning went away.

A week later, cutting what each turn cost, I installed [rtk]. The same
change stopped claustre starting every session at maximum effort. rtk is a
proxy. It sits in front of every Bash command an agent runs and shortens
the output before the model sees it. Its installer, `rtk init -g
--auto-patch`, wrote a hook into my Claude Code settings. It also added a
short `RTK.md` to the instructions Claude Code loads on every turn. I copied
those changes into chezmoi, which manages my dotfiles, so the next apply
wouldn't undo them.

When I stopped using claustre six days later, rtk stayed in my own
settings, still filtering every Bash command before the model saw it. It
was there to make my sessions last. Its README promised 60–90% less
context. I never measured that against my own sessions.

In late July, Claude Code's `/insights` report read back over 193 of my
sessions and recommended five new sections for the instructions loaded on
every turn. Every rule it wanted was already written, in skills, the
instructions Claude Code loads only when a task calls for them. Since the
habits it flagged had happened with those skills already in place, a second
copy loaded on every turn would only crowd the rules that mattered. This
time I didn't take the recommendation. I cut instead, taking what loads on
every turn from 594 lines to 241 on the twenty-sixth of July. The same pass
shortened `RTK.md`, while rtk itself kept running.

That afternoon I filed an issue against my own setup. rtk would show
measured savings on my sessions, or it would leave.

[off-the-desk]: /posts/off-the-desk
[claustre]: https://github.com/pmbrull/claustre
[rtk]: https://github.com/rtk-ai/rtk
