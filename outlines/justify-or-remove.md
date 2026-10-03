# Justify or Remove — outline

**Logline.** The moment of change is beat 3.9, where rtk's own savings
report meets the retries I'd been living with. The story opens on its
opposite in scene 1: rtk arriving as another tool's default and never
measured.

## 1. The warning in claustre's header — *the opposite*

1. claustre ships with rtk turned on and flags its absence in the header. *(chezmoi #11, 2026-04-27)*
2. I switch the check off. *(chezmoi #11)*
3. A week later, cutting tokens per turn, I install rtk anyway. *(chezmoi #94, 2026-05-04)*
4. rtk's installer writes its hook and `RTK.md` into my always-loaded config. *(#94: `rtk init -g --auto-patch`)*
5. I copy its changes into chezmoi as written. *(#94: diffed and ported)*
6. Six days later I drop claustre, and rtk stays. *(chezmoi #158, 2026-05-10)*
7. Nobody measures rtk on this machine. *(chezmoi #444: "never been measured on this host")*

## 2. The trim rtk survived — *the lift*

1. A report on my sessions recommends five more sections for the instructions loaded on every turn. *(chezmoi #431)*
2. The rules it wants already live in skills, which load only when a task calls for them. *(#431: `pr-create`, `issue-work`)*
3. The habits it flagged happened with those skills in place. *(#431)*
4. So I cut instead, taking the always-loaded set from 594 lines to 241. *(chezmoi PR #432, 2026-07-26)*
5. The trim shortens `RTK.md` and leaves rtk running. *(#431 scope)*
6. That afternoon I file an issue: rtk shows measured savings or leaves. *(chezmoi #444, 2026-07-26)*

## 3. Let me try that again — *the turn*

1. The issue sits for two months while rtk keeps filtering. *(#444 open 2026-07-26 to 2026-09-28)*
2. The agents keep bypassing rtk with `rtk proxy`. *(transcripts, 2026-09-06 to 2026-09-28)*
3. In live sessions the agents say rtk mangled the output and rerun unfiltered. *(transcripts, 2026-09-18, 2026-09-20)*
4. How many of the 732 were retries, I never counted. *(author: "more sentiment than measured")*
5. An agent replays rtk's history at Claude Code's output cap, without my intervention. *(chezmoi PR #802)*
6. rtk's own `gain` report says 90.6% saved. *(PR #802)*
7. One `curl` that Claude Code would have truncated anyway accounts for 166M of its 201M tokens. *(PR #802)*
8. Capped, rtk saves 28.7%: about 112 tokens a command, and nothing on 76% of commands. *(PR #802)*
9. The tally counts what rtk cut and never the retries its cuts caused. *(author)*
10. The number confirms what the retries I saw had already decided. *(author: "meh")*

## 4. Crisper, by feel — *the gap*

1. I remove rtk. *(chezmoi PR #802, merged 2026-09-28)*
2. Sessions feel crisper since, with less of the agent running a command twice. *(author)*
3. Crisper is a feeling, and I never measured it. *(no measurement exists)*
4. It might be confirmation bias. *(author)*
5. An agent wrongly blames rtk at least once. *(transcript, 2026-09-21)*
6. The July trim went unmeasured for turn cost too. *(#422 open question)*
7. Outlining this post, I learn rtk was never pinned, though I believed it was. *(author, 2026-10-02)*
8. My own July issue had already said so. *(chezmoi #444)*

## 5. The next thing that asks to load — *the landing*

1. I still look at what each new tool is trying to do, then try it to find out. *(author)*
2. Noticeable friction, with or without telemetry, puts it on notice. *(author)*
3. The verdict mixes measurement with my own sentiment. *(author)*
4. I'm moving it toward measured, so I understand a decision instead of feeling it out. *(author)*
5. Renovate manages every version I pin. *(chezmoi `script/checks/renovate-pins`)*
6. I'm building monitoring for whatever I might want to change. *(chezmoi PRs #662, #680; alunduil-infrastructure PR #562)*
7. The principles are still converging. *(author: "converging instead of definitional")*
8. Some of what a tool brings in, I still notice only later. *(author)*
