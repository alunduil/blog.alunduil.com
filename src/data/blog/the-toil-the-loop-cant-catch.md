---
# FRONTMATTER PLACEHOLDER — finalised in stage 4 (title/description/pubDatetime/tags)
title: The Toil the Loop Can't Catch
author: Alex Brandt
pubDatetime: 2030-01-01T08:00:00-05:00
description: PLACEHOLDER
tags:
  - PLACEHOLDER
---

On the fourth of June I woke to a handful of branches that had gone green
in the night, and I cleared them before work the way you clear the inbox
first thing. Three had been open since the evening before, sitting on
their checks while I slept. I read them and merged them before I left, and
by the time the door shut behind me I'd cleared five, the last not much
after nine.

Then the day job took me and the repositories went quiet. For eight hours
nothing opened and nothing merged. Whatever momentum the morning had, it
waited.

After dinner I picked it back up, the television on in the background, and
this was the part that barely felt like anything. A branch would open, the
checks would run, and a few minutes later they came back green: the
linters, the tests, the small gates I'd been building for months. I read
each diff against them and merged. Eight went by that way between half six
and eight, the system doing the vetting and me keeping pace.

That's what fast feels like from the inside. Not a sprint and not a push,
but work that arrives already half done and already checked, in bursts,
with stretches between where nothing happens at all. The checks had
already said yes. I was agreeing with them.

None of that ease came from typing faster. It came from the months before,
from the checks themselves, each one added on an ordinary evening the way
I'd added the branches that week. Test output that showed a real diff when
it failed instead of a bare pass. A check that ran the observability
configuration on every pull request, so a broken dashboard couldn't merge.
A gate that refused an architecture note written above a certain reading
level. Small things, none of them urgent by themselves.

That's the order it has to go in. The deterministic things first, the
linters and the tests and the version pins, the checks that either pass or
don't, because those are the ones a machine can hold on its own. The
harder brick, the one I'm still reaching for, is judgement: some way to let
a model make the good-enough calls that don't reduce to a green tick. I
don't have that yet. It comes one brick at a time, and you can't lay the
hard one first.

That week I'd been reading a piece from Meta's engineering blog about
testing for sudden, total power loss in a data centre, the kind where you
cut the power to a whole region and see whether it comes back. The section
that stayed with me carried the title Slow is Smooth, Smooth is Fast, and
under it a single claim: reliability and velocity are two facets of the
same coin. You cannot have one without the other.

The speed the agents gave me wasn't in tension with the slow work of
building the checks. It was the payoff. The checks were the smoothness, and
smoothness is what lets the work run fast. The week that looked like a
flood from outside was that slow work, finally paying out.
