# Justify or Remove — outline

**Logline.** The moment of change is the replay that put rtk's savings
figure beside the retries I'd been living with: its tally counted the
tokens it cut and never the turns those cuts cost. The story opens on
its opposite: rtk arriving as another tool's default and never measured.

**Anchors beyond the beats.**

- The replay in chezmoi PR #802 covered 40,929 commands from
  2026-06-30 to 2026-09-27, each capped at Claude Code's
  30,000-character output limit.
- Session transcripts reach back only to 2026-09-06, so July and August
  bypasses aren't on disk. The count matches agent Bash commands
  containing `rtk proxy`, so it's an upper bound on bypasses.

## 1. The warning in claustre's header — *the opposite*

1. claustre ships with rtk turned on and flags its absence in the header; I switch the check off. *(chezmoi #11, 2026-04-27)*
2. A week later, cutting tokens per turn, I install rtk anyway. *(chezmoi #94, 2026-05-04)*
3. rtk's installer writes its hook and `RTK.md` into my always-loaded config, and I copy its changes into chezmoi as written. *(#94: `rtk init -g --auto-patch`, diffed and ported)*
4. Six days later I drop claustre, and rtk stays. *(chezmoi #158, 2026-05-10)*
5. Nobody measures rtk on this machine. *(chezmoi #444: "never been measured on this host")*

## 2. The report that asked for more — *the lift*

1. An `/insights` run over 193 sessions recommends five new sections for my always-loaded instructions. *(chezmoi #431)*
2. Both rules it wants already live in skills, added before its window opened. *(#431: `pr-create`, `issue-work`)*
3. The friction happened with those rules in place, so I cut instead of adding. *(#431: "signal-to-noise, not coverage")*
4. Ten of 26 sections only pointed at a skill, and the always-loaded set drops from 594 lines to 241. *(chezmoi PR #432, 2026-07-26)*
5. The permission allowlist gets the same pass: 16 entries granted nothing Claude Code didn't already allow. *(chezmoi PR #430)*
6. The trim cuts `RTK.md` down to its hook behaviour and leaves rtk running. *(#431 scope)*
7. That afternoon I file the open question: measure rtk's savings or remove it. *(chezmoi #444, 2026-07-26)*

## 3. Let me try that again — *the turn*

1. The issue sits for two months while rtk keeps filtering. *(#444 open 2026-07-26 to 2026-09-28)*
2. The agent keeps reaching for `rtk proxy`, rtk's escape hatch that runs a command unfiltered. *(732 agent commands across 63 sessions, 2026-09-06 to 2026-09-28, transcripts)*
3. The bypasses are retries after rtk cut output the agent needed. *(author)*
4. The replay starts from rtk's own `gain` report: 90.6% saved. *(PR #802)*
5. One `curl` that Claude Code would have truncated anyway accounts for 166M of its 201M tokens. *(PR #802)*
6. Capped the way Claude Code caps output, rtk saves 28.7%: about 112 tokens a command, and nothing on 76% of commands. *(PR #802)*
7. The tally counts what rtk cut and never the retries its cuts caused.
8. The number confirms what the retries had already decided. *(author: "meh")*

## 4. Smoother, by feel — *the landing*

1. I remove rtk. *(chezmoi PR #802, merged 2026-09-28)*
2. Writing down its trust cost, I find it was never pinned. *(#444; author believed it was)*
3. It installed from a third-party repo's `master` and saw the output of every command in every session. *(#444)*
4. Sessions run smoother since, with less of the agent running a command twice. *(author)*
5. Smoother is a feeling, and I never measured it. *(no measurement exists)*
6. The July trim went unmeasured for turn cost too. *(#422 open question)*

## Open

- Does "what loads every turn earns its place with a number, or leaves"
  describe a rule the author now holds? If yes, it becomes beat 4.7; if
  no, the post lands on 4.6.
- File the follow-up idea issue for the cloud-session permission
  contract (chezmoi #428, #429) now, or after #429 resolves?
