---
pubDatetime: 2026-10-24T12:00:00Z
title: The merge queue can't be a bypass actor
source:
  url: https://github.com/dungeon-studio/dungeon-studio-infrastructure/pull/132
  title: Drop genshin's develop merge queue
tags:
  - tooling
---

GitHub blocked every merge when I added its [merge
queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
to a branch that restricts updates to bypass actors. The queue pushes as
`github-merge-queue[bot]`, a bot account that none of a ruleset's bypass actor
types can name. I dropped the queue and couldn't find the limit documented.
