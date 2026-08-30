---
pubDatetime: 2026-07-26T07:00:00Z
title: Under the Instruments
description: "I merged sixty-odd agent-written pull requests in a week, and it barely felt like work. The checks I built watch the code. Nothing watches me."
tags:
  - agentic-coding
  - reliability
  - burnout
shape: essay
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

That week I'd been reading a [piece from Meta's engineering blog][power-loss]
about testing for sudden, total power loss in a data centre, the kind where
you cut the power to a whole region and see whether it comes back. The section
that stayed with me carried the title Slow is Smooth, Smooth is Fast, and
under it a single claim: reliability and velocity are two facets of the
same coin. You cannot have one without the other.

The speed the agents gave me wasn't in tension with the slow work of
building the checks. It was the payoff. The checks were the smoothness, and
smoothness is what lets the work run fast. The week that looked like a
flood from outside was that slow work, finally paying out.

The reason any of it exists is that I can't leave the toil alone, and I
never could. Reliability is my work, and it's also the thing I reach for
when the workday is done. The evening bursts are exactly that, the
rabbit-holing and the yak-shaving I've learned to keep to my own time so
it feeds the job instead of eating it.

It works out better than it sounds. An evening spent teaching my own
repositories to check themselves keeps me fluent in the thing I'm paid to
do all day; the play and the work are the same muscle, and using it after
hours means it's warm by nine the next morning. The tinkering isn't a
break from the job. It's what keeps my head in the game.

The catch is that a reflex like that doesn't clock out. It's the same
drive whether I'm being paid for it or not, and it has no off switch; it
finds the nearest pile of toil and starts in. Most of the time that's a
gift. I've learned it isn't always.

It's failed me once. Not by running too hot, but by going out altogether.

It didn't start with the pandemic. The side projects had been thinning for
a long time before that, the urge to build anything for its own sake going
quiet so slowly I never caught it leaving. By the time the pandemic came,
it was already gone. What a year and a half of working from home did,
alone in a room with the days folding into each other, was take the last
of the energy I had for the job itself.

I didn't burn out in a week, or under a last straw. I burned out by
degrees. Losing the wish to do a thing doesn't feel like a loss; it feels
like not today. Day after day it was not today, and I called that fine.

It took years to come back, to get to where I had this much energy again,
where the wish to build returned and an evening of it feels like play
instead of nothing at all. I still manage depression and anxiety; that
part hasn't left. I watch myself more closely now than I did then, keeping
half an eye on my mood and on how much energy is really there. But
watching isn't the same as reading it right. Last time the ground went
soft slowly, and I stood on it the whole while, calling it solid. So I try
not to overdo it. It's the only gauge I have, and it's never quite
calibrated.

The engineer in me can't leave a gauge that far out of calibration.
Everything
else I've built this year exists to catch what I'd otherwise miss: the
check on every pull request, the test that shows its work, the gate that
stops what shouldn't merge. The whole point of them is that they don't
depend on how I feel. There's a system watching the code now. There isn't
one watching me.

So I've thought about building one. The reflex doesn't stop at
the repositories; it finds the one part of the setup with no telemetry and
reaches for the instruments. Quantified self: resting heart rate, sleep,
the hours I keep, some read on mood I could chart the way I chart
everything else. Give it enough bricks and the operator becomes another
monitored subsystem, watched the same as the rest.

The trouble is that a dashboard measures what you think to measure, and
the thing that took me last time never showed up as a number. It showed
up as not today. It came in under the instruments, through the part of me
that does the
noticing, and that part is the first to go. If I ever need the readout to
tell me I'm going out, the going-out will already have started. Slow is
smooth, smooth is fast. And smooth is also when I stop being able to feel
the cost.

[power-loss]: https://engineering.fb.com/2026/06/03/data-center-engineering/lights-out-systems-on-validating-instant-power-loss-readiness/
