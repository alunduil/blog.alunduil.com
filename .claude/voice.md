# Blog voice

The blog's voice home. Two halves, kept distinct but co-located:

- **Prescriptive rules** (below) — the sentence-level conventions and
  story register to *apply* when drafting or editing a post.
- **Descriptive fingerprint** (further down) — what the published posts
  measurably *do*, calibrated from the corpus. When the two overlap they
  agree; when in doubt, the corpus is the evidence.

Read this before drafting or editing any post — story, review,
methodology, or freeform. `post-draft` and `review-draft` apply it from
here.

Companions, kept separate:

- The host `~/.claude/voice.md` profiles the author's *external* voice
  (PR/issue comments, calibrated against pre-2025 GitHub). It governs that
  surface; this file governs the blog.
- Frontmatter, scheduling, tags, and locations live in
  `docs/reference/post-frontmatter.md`.

Stated in full so the skills stand alone on the web, where host memory
isn't present; bracketed `[[names]]` are local-only see-alsos.

## Sentence-level rules

- **Retrospect observes.** Ownership ("I did X"), stated flat.
  ([[feedback_no_blame_in_retrospect]])
- **Show the mechanism.** "Without X, Y happens."
  ([[feedback_causal_narrative_over_contrast]]) Mechanism earns its
  sentence where it explains a turn; each scene threads on the stake the
  author named, what they were trying to do.
- **Grammar leans CMOS, en_GB for spelling and quotes:** Oxford comma,
  unspaced em-dashes, spelled-out numbers, semicolons; en_GB spelling and
  punctuation outside the quotes. ([[project_grammar_lean]])
- **Possessives:** singular *s*-ending nouns take *'s* — Books's,
  Charles's (CMOS). Add new variants to
  `.vale/styles/config/vocabularies/Custom/accept.txt` as Custom.Spelling
  surfaces them. ([[project_possessive_convention]])
- **One independent clause per sentence.** Split every `, and`, semicolon,
  or comma-splice that hooks two complete thoughts together. Length comes
  from subordinate clauses (`which…`, `while…`, `that…`) and cadence.
  Compound predicates on one subject are fine ("he shows X and stops
  there"); see **Flow** in the register below. A definition and an event
  are two sentences.

## Register: poetic without being poetry

The house register for story posts (Tolkien/Carroll touchstone):

- **Latch first.** Open each scene on something concrete the reader can
  hold.
- **Flow.** Carry weight in cadence and image, in sentences that run
  their full length. A run of short sentences lands after one sentence
  that carries the thread.
- **Punctuation marks structure.** Let the period carry the load. A comma
  only for a grammatical job (clause join, serial list, trailing
  absolute). Colons, semicolons, and em-dashes earn their place by doing
  real structural work. A colon that tacks a list onto a weak phrase
  ("Puzo's is rich: …") is a smell — rewrite so a verb carries it. Serial
  lists take the plain form (a, b, and c).
- **Restrained metaphor.** Dial figures *ever so slightly* — a vivid
  simile usually wants toning down.
- **Watch personification.** It creeps in ("a busy place", "a last sign
  of life") — keep it light.
- Plain, warm words: punch without the snap, music without verse.

## Revision pass

- Drop summary-as-flourish ("outlasted them all", "Everything between me
  and the books").
- State uncertainty as not knowing: "I don't know whether…", "I can't tell
  whether…". The register is secular and plain — "faith" and devotional
  vocabulary are not the author's words, and dressing a limit up as belief
  overstates it.
- Ease in via personal continuity ("I'm still…", "Since college I've
  always…") rather than fragment-label openers.
- Don't repeat temporal anchors; book-end them.
- Em-dashes only for information asides, not drama.
- No announced transitions: cut any sentence whose only job is to signal a
  pivot ("There's more to it, though:", "I'll keep this above the plot");
  state the next thing and let the paragraph break carry the turn.
- No editorialising tail on a close that already lands ("…which is the truest
  thing a book like this could leave me"), and no weak trailing cliffhanger
  ("mostly that's all it is").
- Active verbs over dead linking: an agent doing something beats "X is Y's",
  and never force a verb onto an abstraction ("the mean that reaches",
  "Pragmatism says"). People and tools take the verbs.
- Strip blame: no "I should have", no confession closers.

## Clarity pass

After the revision pass, read each paragraph for crisp, literal prose.
The pass removes packaging and keeps the reasoning: fold a why into a
subordinate clause so sentences still run their full length, and keep
the sentence that explains a turn.

- The paragraph's first sentence latches on the thing the paragraph is
  about.
- One topic per paragraph.
- Every sentence adds information. Cut one whose only job is rhythm,
  contrast, or setting up the next.
- A concrete detail earns its place only if it could have been otherwise.
  A fact true of every case ("it came out in a single pull request") says
  nothing.
- Keep a figure only when the literal version loses information.
- Name the specific thing over a stand-in: what a tool did ("wrote a hook
  into my settings"), what runs out (the allowance, not the hours), which
  rules ("the rules that apply to every task").
- Name things in the vendor's own terms ("session usage limit"), and
  gloss a tool a general reader won't know in a clause on first mention.
- Open a sentence on its real subject and verb, and state the point
  directly.
- After a word or motif's second use, reach for another.
- Repeat the noun where a pronoun's referent sits outside its own
  sentence or could be two things: "rtk's installer", "the agent saw".
  The author reads loose pronouns as ambiguous.

Iterate in the file; apply the rules confidently, surface only genuine
judgement calls.

## Repertoire

The author's own phrasings and stances, gathered while drafting. Reach
for these before inventing an equivalent, and ask the author for the
phrasing when a beat states a stance not listed here.

- Trying tools: "I like trying new things." Adding and removing are
  separate decisions; only using a thing shows whether removal is
  warranted, unless the data is clear. A tool "being a pain" goes without
  much argument.
- Friction: "slowing me down or causing rework". Noticed when "the timing
  is really bad or the results aren't what I expect", and then "I start
  digging".
- Judgement: data driven, and pragmatism treats sentiment as more data to
  take into account. Without data, either measure for a while or act when
  sentiment is "off kilter" enough.
- Renovate keeps tools and dependencies on their latest versions.
  Monitoring, in the industry-standard sense, alerts on conditions the
  author has said they want to know about. Telemetry that explains a
  failure after the fact is not monitoring.
- Practices are "converging instead of definitional".
- Plain colloquial register: "faff", "weird stuff", "meh".

---

The rest of this file is the **descriptive fingerprint** — what the
corpus measurably does. Recalibrate by re-reading the posts.

## Corpus

Four current author posts as of 2026-07: `how-i-back-up`,
`how-i-read-eight-years-on` (methodology); `i-built-the-machine-twice`,
`the-bottleneck-isnt-the-blank-page` (narrative). The archival
restorations under `_<engine>/` are an older, lightly-copyedited era —
weak calibration; weight the four current posts. A fifth,
`backing-up-google-takeout-to-truenas`, is the first how-to — a distinct
instructional register (below), n=1 and provisional.

## Shared DNA — every post

- **First person, throughout.** "I", "my" on nearly every paragraph
  (16–47 per post). The author is always in the frame.
- **Ends on an admitted gap.** Every post's closer names a limitation
  rather than a triumph: "I haven't tested it"; "so far, zero"; "even
  when I can't prove it's the practice doing the work"; "the substrate
  underneath doesn't". The honest-limitation close is the single most
  reliable signature — a draft that lands on a win reads wrong.
- **Hedged, not declarative.** "usually", "in practice", "most of the
  time", "I'm not sure", "it's still too early to know", "on the list".
  Confidence is earned and bounded, never asserted flat.
- **Concrete specifics over abstraction.** Real dates (`2026-06-27`),
  counts (fifty-one kernels, forty-plus books, 2.5 TiB), named tools
  linked inline. Claims ride on something a reader could check.
- **Quantities: prose spelled out, measurements numeric.** "fifteen
  minutes", "six tasks", "forty-plus" but "2.5 TiB", "10-TiB", "02:00",
  "50%", ISO dates. Spell counted things in prose; leave technical
  values as figures.
- **Very low formatting density.** Zero bold, zero bullet lists in the
  body across all four posts — prose carries the structure. Links are
  inline or reference-style. Reach for a list or bold only when the
  content is genuinely tabular, and expect not to.
- **Sentence length swings.** ~13–16 words average, but the real range
  runs 3→47: long flowing sentences that carry weight in cadence, then a
  short declarative that lands it ("The drive did."; "It was never my
  wall."). Uniform medium-length sentences read as generated.
- **Paragraphs are medium, ~4–6 sentences.** One move each; they don't
  sprawl and don't fragment.
- **Openers latch on something concrete** — a callback to a prior post
  or year ("In 2011 I wrote up…", "In 2018 I wrote about…") or a
  concrete image ("The blog had been quiet a long time before I archived
  it").
- **Em-dashes, unspaced, for asides** (CMOS). Present but not leaned on;
  a comma does most joins.

## Register: narrative / reflective

`i-built-the-machine-twice`, `the-bottleneck-isnt-the-blank-page`.

- No section headers — the piece runs as continuous story, built to one
  moment of change.
- Second person to pull the reader in, sparingly ("You picture the blank
  page"). Narrative-only; the methodology posts stay first-person.
- Restrained figuration — a governing image ("the machine", "the wall")
  worked lightly. See the poetic register above.
- Scene and contrast: opens at the opposite of where it lands.

## Register: methodology / reference

`how-i-back-up`, `how-i-read-eight-years-on`.

- `##` section headers when the subject has parts (`how-i-back-up`:
  TrueNAS / Home Assistant / Chromebook); a closing reflection after a
  `---` divider is optional but recurs.
- Plainer and denser with concrete operational detail (cadences, counts,
  dataset names). Expository rather than scene-built.
- Still first-person and still hedged; only the register is plainer. The
  admitted-gap closer holds here too.
- Present tense for current practice, past tense for what changed.

## Register: how-to / instructional

`backing-up-google-takeout-to-truenas` (first as of 2026-07 — n=1, weak
calibration; treat as provisional, recalibrate as more land).

- A Diátaxis how-to: an ordered sequence to a goal the reader already
  has, from a realistic precondition. Prerequisites, then imperative
  steps.
- Overrides the Shared DNA's "no lists / low formatting density" —
  numbered steps are the format for an action sequence.
- Cut explanation and completeness. Fold load-bearing background into a
  step, or link it out (the reference, official docs, the exact
  artefact). The primary failure is "documentation poetry": prose
  wrapped around a code block that doesn't change what the reader types
  — what the narrative register produces if applied here. Keep the steps
  contiguous; trailing notes are where that prose creeps back.
- Still first person and light. Keep one compressed honest-limit close (a
  caveat, sized to a sentence or two). Where an exact version exists, link
  it as the recovery reference.
- Read <https://diataxis.fr/how-to-guides/> for the format; the host
  `diataxis` skill carries fuller anti-patterns. Neither travels to web
  sessions, so this section is the portable copy.

## Anti-tells — the generic-LLM markers to strip

- Bold-for-emphasis and bulleted lists where prose would carry it.
- A triumphant or summarising closer instead of an admitted gap.
- Flat declaratives with no hedge; uniform medium sentence length.
- Section headers on a reflective/narrative piece.
- Abstraction where the corpus would name a date, a count, or a tool.
- Applying the narrative flourish register to an instructional post —
  aphorisms, scene-setting, explanation wrapped around steps.
