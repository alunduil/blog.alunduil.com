# Blog voice

Descriptive fingerprint of this blog's published voice, calibrated
against the author-written posts in `src/data/blog/` (not the AstroPaper
upstream tutorial posts). Use it when Claude drafts or edits any post —
story, methodology, or freeform.

Two companions, kept distinct:

- `post-draft/SKILL.md` §2 is the *prescriptive* story register — rules
  to apply (CMOS grammar, latch-first, no blame in retrospect). This
  file is the *descriptive* corpus fingerprint — what the published
  posts measurably do. When they overlap they agree; when in doubt,
  the corpus here is the evidence.
- The host `~/.claude/voice.md` profiles the author's *external* voice
  (PR/issue comments, calibrated against pre-2025 GitHub). Different
  corpus, different surface — don't apply it to blog posts.

## Corpus

Four current author posts as of 2026-07: `how-i-back-up`,
`how-i-read-eight-years-on` (methodology); `i-built-the-machine-twice`,
`the-bottleneck-isnt-the-blank-page` (narrative). The archival
restorations under `_hakyll/` are an older, lightly-copyedited era —
weak calibration; weight the four current posts. Recalibrate by
re-reading the corpus, not by editing numbers here from memory.

## Shared DNA — every post

- **First person, throughout.** "I", "my" on nearly every paragraph
  (16–47 per post). The author is always in the frame; no detached
  third-person exposition.
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
  inline or reference-style, never decorative. Reach for a list or bold
  only when the content is genuinely tabular, and expect not to.
- **Sentence length swings.** ~13–16 words average, but the real range
  runs 3→47: long flowing sentences that carry weight in cadence, then a
  short declarative that lands it ("The drive did."; "It was never my
  wall."). Uniform medium-length sentences read as generated.
- **Paragraphs are medium, ~4–6 sentences.** One move each; they don't
  sprawl and don't fragment.
- **Openers latch on something concrete** — a callback to a prior post
  or year ("In 2011 I wrote up…", "In 2018 I wrote about…") or a
  concrete image ("The blog had been quiet a long time before I archived
  it"). Never a context-free abstraction.
- **Em-dashes, unspaced, for asides** (CMOS). Present but not leaned on;
  a comma does most joins.

## Register: narrative / reflective

`i-built-the-machine-twice`, `the-bottleneck-isnt-the-blank-page`.

- No section headers — the piece runs as continuous story, built to one
  moment of change.
- Second person to pull the reader in, sparingly ("You picture the blank
  page"). Narrative-only; the methodology posts stay first-person.
- Restrained figuration — a governing image ("the machine", "the wall")
  worked lightly, never purple. See `post-draft/SKILL.md` §2 for the
  full "poetic without being poetry" register.
- Scene and contrast: opens at the opposite of where it lands.

## Register: methodology / reference

`how-i-back-up`, `how-i-read-eight-years-on`.

- `##` section headers when the subject has parts (`how-i-back-up`:
  TrueNAS / Home Assistant / Chromebook); a closing reflection after a
  `---` divider is optional but recurs.
- Plainer and denser with concrete operational detail (cadences, counts,
  dataset names). Expository rather than scene-built.
- Still first-person and still hedged — the register is plainer, not
  more authoritative. The admitted-gap closer holds here too.
- Present tense for current practice, past tense for what changed.

## Anti-tells — the generic-LLM markers to strip

- Bold-for-emphasis and bulleted lists where prose would carry it.
- A triumphant or summarising closer instead of an admitted gap.
- Flat declaratives with no hedge; uniform medium sentence length.
- Section headers on a reflective/narrative piece.
- Abstraction where the corpus would name a date, a count, or a tool.
