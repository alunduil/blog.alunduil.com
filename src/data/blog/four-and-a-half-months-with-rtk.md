---
pubDatetime: 2026-10-13T07:00:00Z
title: Four and a Half Months with rtk
description: "I added rtk to make my Claude sessions last and kept it for months unmeasured. Using it is what told me to take it out."
tags:
  - agentic-coding
  - tooling
  - decision-making
---

In April I moved my work to Claude and [rebuilt my tooling around
it][off-the-desk]. I kept hitting Claude's session usage limit, which resets
every five hours. So I went looking for ways to make the allowance last until
the limit reset.

I ran those sessions from [claustre], a terminal dashboard for working across
several projects at once. claustre came with rtk support turned on. On a
machine without rtk, the top of the screen read `rtk not installed — press c
to configure`. On the twenty-seventh of April I turned rtk support off in
claustre's settings.

A week later, cutting what each turn cost, I installed [rtk]. rtk is a proxy
that sits in front of every Bash command an agent runs and shortens each
command's output before the model reads the result. rtk's installer, `rtk init
-g --auto-patch`, wrote a hook into my Claude Code settings. The installer
also added a short `RTK.md` to the instructions Claude Code loads on every
turn. I copied those changes into [alunduil-chezmoi], my dotfiles repository,
so the next chezmoi apply wouldn't undo them.

When I stopped using claustre six days later, rtk stayed in my own settings.
rtk's README promised 60–90% less context. I never measured the 60–90% against
my own sessions.

By late July, Claude Code's `/insights` report read back over 193 of my
sessions and recommended five new sections for the instructions loaded on
every turn. Every rule the report wanted already existed in skills, the
instructions Claude Code loads only when a task calls for them. Since the
habits the report flagged had happened with those skills already in place, a
second copy loaded on every turn would only crowd the rules that apply to
every task. This time I didn't take the recommendation. I cut instead, taking
what loads on every turn from 594 lines to 241 on the twenty-sixth of July.
The same pass shortened `RTK.md`, while rtk itself kept running.

That afternoon I [filed an issue][issue] against my own setup. rtk would show
measured savings in my sessions, or I'd remove rtk.

The issue sat open for two months while rtk went on filtering every command.
In that time the agents kept bypassing rtk. rtk has an escape hatch, `rtk
proxy`, which runs a command unfiltered. In the three weeks of transcripts I
still have, `rtk proxy` appears in 732 agent commands across 63 sessions.

I watched agents bypass rtk in live sessions. When a check came back clean or
empty, the agent would often explain a turn later that rtk had changed what
the agent saw. On the eighteenth of September one agent put it this way:

> That's the second time this session a grep-based sweep gave me a
> confident wrong answer—the earlier one was `rtk` reformatting `git diff`
> out from under a `^+` filter.

Two days later another found "the rtk filtering proxy masking `diff`'s exit
code" and reran the comparison unfiltered. I didn't count how many of the 732
were reruns like these. I only saw the sessions I was watching. Even there, I
mostly caught the reruns in Claude's thinking. Claude sometimes summarises
that thinking out of the turn. Then I miss the reruns completely.

On the twenty-seventh of September I handed the question to an agent. The
agent ran [the replay][replay] on its own, taking rtk's history of 40,929
commands since the end of June and capping each command at the 30,000
characters of output Claude Code keeps anyway. rtk's own `gain` report put the
savings at 90.6%. One `curl` accounted for 166M of the report's 201M tokens,
output Claude Code would have cut down regardless. Capped that way, rtk saved
28.7%, about 112 tokens a command. On 76% of commands rtk saved nothing.

rtk was there to keep my sessions from running out early. rtk's tally counted
the cut output and never the reruns those cuts caused. Every rerun spent
another turn against the same limit. The number didn't tell me anything the
sessions hadn't.

I removed rtk the next morning. My sessions have felt crisper since, with less
of the agent rerunning a command to see the real output.

I have no numbers on whether my sessions are crisper. The difference might be
confirmation bias. Even the agents sometimes blamed rtk for output rtk hadn't
touched. On the twenty-first of September one agent wrote "my claim that rtk
trims the first `git log` line doesn't reproduce" after comparing filtered and
unfiltered output. I never measured what the July trim saved on each turn
either.

I still add tools because I like trying new things. Using a tool is the only
way to find out whether the tool should stay, unless data settles the question
first. rtk had four and a half months of use before I took rtk out. Removing a
tool and adding one are separate decisions. If a tool's being a pain, I don't
argue with myself much.

I'm data driven. To me, a feeling about a tool is more data to take into
account. When I don't have the data, I either add a way to measure and give
the measurement a while or act because something feels far enough off kilter.
The replay read rtk's own history database, which held three months of
commands by then. I didn't open that database until the sessions had gone
wrong often enough.

Friction shows up as something slowing me down or causing rework. I rarely
notice friction until the timing is really bad or a result isn't what I
expected, like a `diff` that comes back identical when the files aren't. Then
I start digging.

[off-the-desk]: /posts/off-the-desk
[claustre]: https://github.com/pmbrull/claustre
[rtk]: https://github.com/rtk-ai/rtk
[alunduil-chezmoi]: https://github.com/alunduil/alunduil-chezmoi
[issue]: https://github.com/alunduil/alunduil-chezmoi/issues/444
[replay]: https://github.com/alunduil/alunduil-chezmoi/pull/802
