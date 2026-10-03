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

The issue sat open for two months while rtk went on filtering every
command. In that time the agents kept bypassing it. rtk has an escape
hatch, `rtk proxy`, which runs a command and leaves its output alone. In
the three weeks of transcripts I still have, it appears in 732 agent
commands across 63 sessions.

I watched it happen in live sessions. When a check came back clean or
empty, the agent would often explain a turn later that rtk had changed what
it saw. On the eighteenth of
September one said a grep-based sweep had given it "a confident wrong
answer" because rtk had reformatted `git diff` out from under its filter.
Two days later another found "the rtk filtering proxy masking `diff`'s exit
code" and reran the comparison unfiltered. I never counted how many of the
732 were reruns like these. What I had was the sessions I'd sat through.

On the twenty-seventh of September I handed the question to an agent. It
ran the replay on its own, taking rtk's history of 40,929 commands since
the end of June and capping each one at the 30,000 characters of output
Claude Code keeps anyway. rtk's own `gain` report claimed 90.6% saved. One
`curl` accounted for 166M of its 201M tokens, output Claude Code would have
cut down regardless. With every command capped the way Claude Code caps it,
rtk saved 28.7%. That came to about 112 tokens a command. On 76% of
commands it saved nothing.

rtk's tally counted what it cut and never the reruns its cuts caused. By
the time the number came back, the sessions had already decided. It only
confirmed them.

[off-the-desk]: /posts/off-the-desk
[claustre]: https://github.com/pmbrull/claustre
[rtk]: https://github.com/rtk-ai/rtk
