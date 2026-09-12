# Nothing Goes Without Saying — outline

Opens at scene 1 and lands at scene 5: rewriting two published posts to
clear a readability score I deleted in May for being the wrong target.
Beck's forest and desert set the question; Meyer's high-to-low context
scale answers it, because an agent shares no history with me and keeps
none between sessions.

**Anchors beyond the beats.**

- Beck, *Forest & Desert* — <https://newsletter.kentbeck.com/p/forest-and-desert>.
  Desert list: detailed design documents, senior engineers doing project
  management, multiple levels of review, estimation, urgency. Forest
  list: developers write tests, collective code ownership, build
  incrementally, refactor, guilds, pair, release continuously, smaller
  slices, stop setting deadlines, weekly demos.
- Meyer, *The Culture Map*, communicating scale. Both load-bearing lines
  are in the author's highlights: "Multicultural teams need low-context
  processes." "The tendency to put everything in writing, which is a mark
  of professionalism and transparency in a low-context culture, may
  suggest to high-context colleagues that you don't trust them to follow
  through on their verbal commitments."

## 1. Five files, deleted — *the opposite*

1. Three days after wiring Vale into the repo I delete the whole readability package *(84de5cd, 2026-05-07)*
2. Five rule files go: Flesch Reading Ease, Flesch-Kincaid, Coleman-Liau, Gunning Fog, Automated Readability *(84de5cd)*
3. The commit says those scores aim at an eighth-grade reading level, the wrong target for technical writing *(84de5cd)*
4. write-good goes the same afternoon for being overzealous about E-Prime *(84de5cd)*
5. Seven per-rule overrides come down to three, each survivor a call I would defend out loud *(84de5cd)*

## 2. The hooks move to CI — *the lift*

1. Three days later pre-commit runs on every push to main and every pull request *(1ba3039, #120, 2026-05-10)*
2. markdownlint, yamllint, and a vendored en_GB Hunspell dictionary land the same day *(391da2a, 428583b, 9f0253f, 2026-05-10)*
3. Spelling stops being a preference and becomes a dictionary file
4. No part of the standard is settled in conversation now; it passes the hook or it blocks the merge

## 3. The score comes back — *the reversal I don't notice making*

1. Seven weeks on, the readability package returns, riding in on the pull request that publishes a post *(98c2b9c, #260, 2026-06-26)*
2. One metric of the seven survives: Flesch Reading Ease at or above 70, at error level *(`.vale.ini`)*
3. Two already-published posts score below it, so they get per-file exemptions and the gate lands anyway *(#260)*
4. That same week I file the objection to my own compromise: grandfathering is an inconsistent standard *(#265, 2026-06-21)*

## 4. Two lists in my highlights — *the frame that doesn't fit*

1. Kent Beck sorts engineering advice by the ground it grows in, desert or forest *(newsletter.kentbeck.com/p/forest-and-desert)*
2. The desert gets design documents, layered review, estimation, urgency; the forest gets pairing, collective ownership, continuous release, no deadlines *(Beck)*
3. Beck puts the cause above the team: a desert exists because the fruits of the forest aren't what the executives value *(Beck)*
4. I save both lists and file them as something to write about *(#342, 2026-07-18)*
5. Neither picture is mine — I'm growing a forest across one GitHub organisation so its tools are there to carry into whatever desert I land in

## 5. 59.67 to 84.01 — *the turn*

1. Before setting the bar I score every current post with a throwaway reporting rule, to find the band the corpus actually sits in *(#392 verification)*
2. Then I open `how-i-read-eight-years-on` and `how-i-back-up` and rewrite nearly every sentence *(#392, 2026-08-12)*
3. 59.67 becomes 84.01; 65.48 becomes 79.06 *(1651ca8)*
4. Same datasets, counts, cadences, tools, and claims — only the sentences moved *(#392)*
5. The exemptions come out of `.vale.ini` and nothing stays grandfathered *(#392)*

## 6. The line I'd highlighted — *the recognition*

1. Meyer's communicating scale runs from high context to low *(The Culture Map)*
2. A high-context team shares enough history that the meaning survives without being said *(Meyer)*
3. Her rule for a team that mixes the two: multicultural teams need low-context processes *(Meyer)*
4. An agent shares no history with me and keeps none between sessions
5. That is why collective ownership never stuck here and pairing has nobody to pair with
6. Beck's forest practices are the high-context ones; they move knowledge between people who were both there
7. What survives the move is whatever I can write down and hand to a machine to check
8. Every rule in `.vale.ini` carries a comment saying why it is set that way, for whoever opens the file next *(`.vale.ini`)*

## 7. Another rule, written by me — *the landing*

1. Two days after the rewrite I write a Vale rule of my own, so a date in prose has to be RFC 3339 *(7141074, #521, 2026-08-14)*
2. Its comments tell the next reader why the month list appears twice, because RE2 has no subroutine references *(`Custom/DateFormat.yml`)*
3. Meyer's other finding: putting everything in writing tells a high-context colleague you don't trust them *(The Culture Map)*
4. Every gate here is aimed at a collaborator that can't take offence
5. I keep adding them
6. Beyond build systems that push correctness into the work, I've tried almost none of the forest practices, so I can't say which would survive the move
7. I don't know where validation stops being correctness and starts being the only thing holding the standard, and more of the work runs now while I'm not watching

## Open

- Tuckman is cut. Two frameworks is the post's ceiling, and his stages
  answer a question about time that neither Beck nor Meyer is asking. If
  he returns as a clause in scene 4, the citation is "Developmental
  Sequence in Small Groups," *Psychological Bulletin* 63(6), 1965 — the
  Media Log title is slightly off.
- The Spotify Engineering Culture video from #342 is out too. It
  illustrates Beck rather than advancing the arc.
- *The Art of Business Value* stays out — unfinished, and Meyer does the
  job Schwartz would have done.
- Scene 7 must not land where `who-accounts-for-the-agent` did (being
  exacting with a machine teaching the author to be exacting with people
  again). Different gap, deliberately.
- `pubDatetime` unset. Next open Tuesday slot on `main` is 2026-09-15;
  other worktree branches not yet checked for a collision.
