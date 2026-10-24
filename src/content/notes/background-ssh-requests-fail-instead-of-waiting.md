---
pubDatetime: 2026-10-24T13:00:00Z
title: Background SSH requests fail instead of waiting
source:
  url: https://github.com/alunduil/alunduil-chezmoi/pull/959
  title: Fail fast for ssh callers with no terminal
tags:
  - tooling
---

A script loads my SSH key from 1Password for eight hours. On expiry, some two
hundred background requests blocked my `git fetch`. Now the script exits without
a terminal, so only commands I run ask 1Password.
<https://github.com/alunduil/alunduil-chezmoi/blob/main/dot_local/bin/executable_ssh-load.tmpl>
