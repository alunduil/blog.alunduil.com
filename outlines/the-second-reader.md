# The Second Reader — outline

**Logline.** A week of agent-identity plumbing sent me back to a scan I had
already passed, and the same output read as a reader's access requirements.
The crawler stopped being traffic to manage and became a second reader to
write for.

**Opens on** the site built for exactly one human reader (scene 1).
**Lands on** the reader I can't observe: the scanner grades my host, and the
beacon that would see the agent sits in a layout the agent never loads
(scene 5).

**Register.** Methodology told as narrative — first-person, one recognition
at the centre, concrete artefacts throughout. Closer to
`who-accounts-for-the-agent` than to `how-i-back-up`; no section headers.

**Anchors beyond the beats.**

- Cloudflare Agent Readiness score, Apr 2026 —
  <https://blog.cloudflare.com/agent-readiness/>; scanner at
  <https://isitagentready.com>
- Scan 2026-06-22, Level 2 "Bot-Aware" — pass `robotsTxt`, `sitemap`,
  `robotsTxtAiRules`, `contentSignals`; fail `linkHeaders`, `dnsAid`,
  `markdownNegotiation`
- PR #264 line split: `robots.txt.ts` one line, `llms.txt.ts` 33,
  `posts/[...slug]/index.md.ts` 18
- Cloudflare Web Analytics reads `rumPageloadEventsAdaptiveGroups`; zone
  HTTP analytics are empty because Pages serves unproxied
- Reading week (Readwise, June 2026, canonical URLs TBD): temporary
  Cloudflare accounts for AI agents; OAuth extended across the Cloudflare
  app ecosystem; prompt injection as role confusion

## 1. Two themes for one reader — *the opposite*

1. The site follows the reader's theme twice over — every code block ships in both `min-light` and `night-owl`, and an image with a `-dark` sibling under `public/` swaps with the toggle. *(`docs/reference/post-body.md`)*
2. Pagefind builds a search index at build time so a reader can find an old post without leaving the page. *(`pnpm build`)*
3. Each of those assumes eyes, a screen, and a preference about brightness.

## 2. A score I could fix in an afternoon — *the chore*

1. Cloudflare published an Agent Readiness score in April, with a free scanner alongside it. *(<https://blog.cloudflare.com/agent-readiness/>, <https://isitagentready.com>)*
2. I scanned the blog, filed the gaps, and treated the result as housekeeping. *(#76)*
3. Three of the five dimensions applied to a static site; API catalogues, MCP server cards, OAuth discovery, and commerce protocols didn't. *(#76 scope)*
4. The work came to fifty-two lines across three files: one `Content-Signal` line in `robots.txt`, an `llms.txt` endpoint, and an `index.md` endpoint per post. *(#264, merged 2026-06-21)*
5. Cheap enough that I shipped it without asking what it was for.

## 3. Reading the same output again — *the turn*

1. That week my reading kept landing on the same plumbing: temporary accounts issued to AI agents, OAuth extended to cover them, prompt injection explained as role confusion. *(Readwise, June 2026)*
2. Each piece treats the agent as a party that arrives, identifies itself, and is granted a scope — the questions you'd ask about a person.
3. I ran the scan again with that in my head. *(<https://isitagentready.com>)*
4. Discoverability, content accessibility, and bot access name what a reader needs: to find the writing, to fetch it, and to be allowed to.
5. The crawler stopped being traffic to manage and became a reader to write for.
6. The manifests are a second edition — `llms.txt` is the table of contents, and `index.md` is the same post in the form that reader can hold. *(`src/pages/llms.txt.ts`, `src/pages/posts/[...slug]/index.md.ts`)*

## 4. Saying yes out loud — *the stance*

1. `Content-Signal` makes the question explicit: `search`, `ai-input`, and `ai-train`, each answered yes or no, in `robots.txt` where anyone can read it. *(`src/pages/robots.txt.ts`)*
2. The argument around that header runs to blocking crawlers, paywalling them, and poisoning what they fetch. *(citation TBD — needs a real source, or soften to the arguments I've actually read)*
3. I answered `search=yes, ai-input=yes, ai-train=yes` and didn't weigh it long. *(#264)*
4. The blog is a knowledge base, not a possession — it exists so that whoever wants what's written here can reach it, and a model trained on it reaches further than I can.
5. Omitting the header wouldn't have been neutral, because silence reads as refusal. *(#76 decision note, 2026-06-21)*
6. So the only choice was whether to answer in `robots.txt` or leave it to inference.

## 5. The reader who never runs the JavaScript — *the landing*

1. The live scan came back Level 2, "Bot-Aware." *(2026-06-22)*
2. Every failure is the host: no `Link:` headers, no DNS-AID, because bare GitHub Pages doesn't let me set a response header. *(#76 verification note)*
3. `markdownNegotiation` fails too, and every post is already served as clean Markdown — the check asks whether my server honours `Accept: text/markdown`, not whether the Markdown is there. *(`src/pages/posts/[...slug]/index.md.ts`)*
4. So the grade measures what my host can say, not what my writing offers.
5. The reader itself I can't see at all: Cloudflare Web Analytics is a JavaScript beacon, and an agent pulling `/posts/<slug>/index.md` never runs it. *(confirm the beacon requirement against Cloudflare's docs in the citations pass)*
6. There are no server logs to fall back on either, because Pages serves unproxied and the zone analytics are empty.
7. Nothing has come back — no citation, nobody mentioning an assistant summarised a post — and I've filed an issue to go looking properly. *(#547)*

## Open

- **Beat 4.2 needs a source** for the blocking, paywalling, and poisoning
  argument. Failing one, soften to the arguments I've read.
- **Canonical URLs for the three reading-week sources.** The Readwise
  entries are private placeholders; pull the public source URLs in the
  citations pass and keep no `read.readwise.io` links in the body.
- **Verify the Agent Readiness announcement date** (Apr 2026) against the
  Cloudflare post before the body asserts it.
- **Confirm the beacon requirement** (beat 5.5) against Cloudflare's docs.
  Supporting evidence: #141 added the beacon as a script tag in the base
  layout, which the `.md` and `llms.txt` responses never carry.
- **Watch beat 5.4** in `post-draft` — the host-versus-writing finding sits
  one beat from the close and shouldn't read as its own peak.
