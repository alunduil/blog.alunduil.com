# The Toil the Loop Can't Catch — outline

*(Working title — a handle for the file and the angle, not a commitment.
Real title chosen in post-draft once the prose settles what it argues.)*

**Logline.** One week I merged sixty-odd agent-authored PRs across two
repos, and it ran effortlessly — because "slow is smooth, smooth is fast"
was never marksmanship folklore. I read it as the section title of a Meta
Engineering post that week, arguing reliability and velocity are the same
coin, and it names exactly the SRE toil-reduction I practise: the
smoothness is the self-correcting system I built one brick at a time. The
moment of change: the doctrine I now live by, I read on my old employer's
blog — the same place I burned out — and the feedback loops I trust to
catch everything have no sensor pointed at the operator running them.
Opens at its opposite: inside the effortless week, before the cost is
visible.

**Register.** Hybrid: personal/reflective narrative spine, with the
adage-as-SRE-doctrine re-read as one embedded analytical turn (scene 2),
not lifted into its own essay.

**Arc.** Effortless ease → what the ease is actually made of (and where
the phrase came from) → why it's both work and play → I've felt this
momentum before, and the phrase came from there too → the one thing the
system can't watch.

**Verified citations (author can double-check each).**

- **The highlight's source** — "Slow is Smooth. Smooth is Fast" is a
  section title in *Lights Out, Systems On: Validating Instant Power Loss
  Readiness*, Engineering at Meta, 2026-06-03
  (<https://engineering.fb.com/2026/06/03/data-center-engineering/lights-out-systems-on-validating-instant-power-loss-readiness/>;
  saved copy read.readwise.io/read/01kt9q1d8krcq9vp8epx7y7f3y). Load-
  bearing quote: *"Reliability and velocity are two facets of the same
  coin. You cannot have one without the other."* The post argues
  incremental, defense-in-depth reliability *enables* velocity — the
  exact toil-reduction reframe.
- **The count** — window 2026-05-31 to 2026-06-07
  (`gh search prs --repo alunduil/<repo> --merged --merged-at
  2026-05-31..2026-06-07`): alunduil-chezmoi 73 merged (54 authored by
  me, 19 Renovate); alunduil-infrastructure 25 (6 me, 19 Renovate). So
  **~60 PRs I authored, ~98 merged counting Renovate's 38 dependency
  bumps.** Peak day 2026-06-04 (17 merges in chezmoi). The issue's "~49"
  undercounts — the honest figure is sixty-odd authored / close to a
  hundred merged.
- ***Flow*** — Csikszentmihalyi, currently reading (Media Log; author-
  confirm the read was concurrent).

**Author-owned, still open.**

- **Disclosure dial** on the Meta / depression / anxiety beat — how
  explicit on a public post. Materially shapes scene 4; only you set it.
- **Opening moment** — scene 1 can anchor on the 2026-06-04 peak
  (seventeen merges in a day), or a specific PR / evening you remember
  noticing it was easy.
- **The next brick** — no tracked issue exists for the nondeterministic
  "good-enough" evaluator, so it stays your stated intent, general and
  hedged. Name the specific thing if you want it concrete.

---

## 1. The effortless week — *the opposite*

1. A single day that spring, seventeen PRs merged and I barely felt the
   effort *(2026-06-04, alunduil-chezmoi)*
2. The week around it ran the same: sixty-odd branches I opened, the
   agents drafted and revised, Renovate closed its own *(2026-05-31 to
   2026-06-07; ~98 merges counting Renovate's 38)*
3. It felt like the machine running oiled — fast, frictionless, in
   control; this is what "fast" looks like from the inside

## 2. The bricks under the ease — *the lift (embedded analytical turn)*

1. The ease didn't come from anyone typing faster
2. It came from bricks laid one at a time: CI, tests, linting first — the
   classics
3. Then the harder brick I'm still reaching for: nondeterministic,
   good-enough evaluation *(stated intent; no tracked issue yet)*
4. "Slow is smooth, smooth is fast" isn't marksmanship folklore to me — I
   read it that week as a section title in a Meta Engineering post *(2026-06-03,
   engineering.fb.com; read.readwise.io/read/01kt9q1d8krcq9vp8epx7y7f3y)*
5. Its claim is mine: *reliability and velocity are two facets of the same
   coin* — build the self-correcting system slowly, it runs smooth, smooth
   is what lets it run fast
6. The agents' speed cashes the check the scaffolding wrote — the tension
   the week seemed to pose dissolves

## 3. Why it's both my job and my hobby — *the braid*

1. The fixing-toil reflex doesn't clock out — same instinct at work and at
   play
2. I do the rabbit-holing and yak-shaving in spare time so it doesn't eat
   work time
3. And that keeps my head in the game at work — the play feeds the job
4. *Flow* open on the desk the same week *(Csikszentmihalyi, currently
   reading — Media Log)*; I'd read the phrase as pulling against the merge
   count
5. It doesn't pull against it — the Meta post and the count are the same
   practice, stated twice *(hands the reader forward: the phrase came from
   Meta)*

## 4. I've run this hot before — *the turn*

1. The doctrine I live by, I read on my old employer's engineering blog
   *(the highlight's provenance pays off here)*
2. I know this momentum from there too: it ran smooth right up until it
   didn't
3. Meta *(author-confirmed; disclosure dial TBD)*
4. I burned out, and it took years to get back this much energy
5. I still manage depression and anxiety *(observed, not apologised — no
   blame in retrospect)*
6. The same drive that lays the bricks is the one that doesn't always know
   when to stop

## 5. The toil the loop can't catch — *the landing*

1. The feedback loops catch the code's errors; the system self-corrects
   almost everything — Renovate closes a third of the week on its own
2. Almost — there's no sensor pointed at the operator
3. I'm building toward the barrier one brick at a time, but the evaluation
   I most need can't be automated: am I running too hot again?
4. From inside the smooth, I can't always feel it — that's what smooth is
5. Slow is smooth, smooth is fast — and fast has a cost the loop was never
   built to see *(admitted gap)*

## Open

- **Disclosure dial** — how explicit the Meta / mental-health beat runs on
  a public post. Author's call; shapes scene 4.
- **Opening moment** — confirm the 2026-06-04 seventeen-merge day as
  scene 1's anchor, or supply a specific PR / evening.
- **Flow concurrency** — confirm you were reading it that same week (Media
  Log), or drop it and let the Meta post carry the reading beat alone.
- **The next brick** — keep general, or name the specific nondeterministic
  evaluator you're building toward.
- **Scene 3 load** — carries work/play braid *and* the reading pairing;
  the "it came from Meta" hinge now hands forward into scene 4, which
  should relieve the overload — verify it reads clean.
