---
pubDatetime: 2026-10-19T17:30:00Z
title: Closing stale pull requests
source:
  url: https://github.com/alunduil/blog.alunduil.com/blob/main/.github/workflows/daily.yml
  title: daily.yml
tags:
  - tooling
---

I added [actions/stale](https://github.com/actions/stale) to four of my
repositories to manage pull requests, including submissions and my own drafts.
It labels a pull request stale after thirty days of inactivity and closes it
fourteen days later. [Renovate](https://docs.renovatebot.com/) pull requests are
exempt, since closing one makes Renovate ignore that update.
