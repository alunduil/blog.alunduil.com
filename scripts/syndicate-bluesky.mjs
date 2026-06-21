// Syndicate newly published posts to Bluesky (POSSE; see issue #77).
//
// The blog stays canonical; Bluesky is a notification channel pointing back.
// Source of truth is the live RSS feed, which already gates on publish time
// (src/utils/postFilter.ts), so future-dated posts never leak here.
//
// De-duplication has two independent guards, so no state file is committed:
//   1. A recency window (SYNDICATE_WINDOW_HOURS) bounds what is eligible. On
//      first run this keeps the entire archive from flooding Bluesky, and it
//      stops a post from re-syndicating forever once it ages out.
//   2. Within that window, the author's recent Bluesky feed is queried and any
//      post whose canonical URL already appears there is skipped. This catches
//      the common case of multiple deploys on the same day.
//
// Known gap: editing a post older than the window sets RSS pubDate to its
// modDatetime, which can pull it back into the window; if its original
// syndication has scrolled past the queried feed depth it would re-post. Rare
// for a low-volume blog — revisit if it bites.

import { AtpAgent, RichText } from "@atproto/api";
import { XMLParser } from "fast-xml-parser";

const FEED_URL = process.env.FEED_URL ?? "https://blog.alunduil.com/rss.xml";
const SERVICE = process.env.BLUESKY_SERVICE ?? "https://bsky.social";
const WINDOW_HOURS = Number(process.env.SYNDICATE_WINDOW_HOURS ?? "48");
const DRY_RUN =
  process.env.DRY_RUN === "true" || process.argv.includes("--dry-run");

// Bluesky caps post text at 300 graphemes; the embed card carries the full
// title and description regardless, so the text is just a teaser.
const MAX_GRAPHEMES = 300;
const FEED_PAGES = 3;
const FEED_PAGE_SIZE = 100;

function fail(message) {
  console.error(`syndicate: ${message}`);
  process.exit(1);
}

async function fetchPublishedItems() {
  const res = await fetch(FEED_URL);
  if (!res.ok) fail(`fetching ${FEED_URL} returned ${res.status}`);
  const parser = new XMLParser();
  const feed = parser.parse(await res.text());
  const items = feed?.rss?.channel?.item ?? [];
  // fast-xml-parser collapses a single <item> to an object.
  return (Array.isArray(items) ? items : [items]).map(item => ({
    title: String(item.title),
    description: String(item.description),
    link: String(item.link),
    pubDate: new Date(item.pubDate),
  }));
}

// Every canonical URL already on the author's recent feed, gathered from the
// external embed (where we put the link) and the post text as a fallback.
async function fetchSyndicatedUrls(agent, actor) {
  const urls = new Set();
  let cursor;
  for (let page = 0; page < FEED_PAGES; page++) {
    const { data } = await agent.getAuthorFeed({
      actor,
      limit: FEED_PAGE_SIZE,
      cursor,
    });
    for (const { post } of data.feed) {
      const embedUri = post.embed?.external?.uri;
      if (embedUri) urls.add(embedUri);
      const text = post.record?.text;
      if (text) {
        for (const match of text.matchAll(/https?:\/\/\S+/g)) {
          urls.add(match[0]);
        }
      }
    }
    cursor = data.cursor;
    if (!cursor) break;
  }
  return urls;
}

function buildText(title, description) {
  const full = `${title}\n\n${description}`;
  if (new RichText({ text: full }).graphemeLength <= MAX_GRAPHEMES) return full;
  // Trim the hook, never the title; reserve room for the title, separator,
  // and ellipsis.
  const reserved = Array.from(`${title}\n\n…`).length;
  const room = MAX_GRAPHEMES - reserved;
  const hook = Array.from(description).slice(0, Math.max(0, room)).join("");
  return `${title}\n\n${hook}…`;
}

async function post(agent, item) {
  const text = buildText(item.title, item.description);
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  await agent.post({
    text: rt.text,
    facets: rt.facets,
    embed: {
      $type: "app.bsky.embed.external",
      external: {
        uri: item.link,
        title: item.title,
        description: item.description,
      },
    },
    createdAt: new Date().toISOString(),
  });
}

const identifier = process.env.BLUESKY_IDENTIFIER;
const password = process.env.BLUESKY_APP_PASSWORD;
if (!identifier) fail("BLUESKY_IDENTIFIER is not set");
if (!password) fail("BLUESKY_APP_PASSWORD is not set");

const agent = new AtpAgent({ service: SERVICE });
await agent.login({ identifier, password });

const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;
const items = await fetchPublishedItems();
const recent = items.filter(item => item.pubDate.getTime() >= cutoff);
const syndicated = await fetchSyndicatedUrls(agent, identifier);
const pending = recent.filter(item => !syndicated.has(item.link));

console.log(
  `syndicate: ${items.length} in feed, ${recent.length} within ${WINDOW_HOURS}h, ${pending.length} to post`
);

for (const item of pending) {
  if (DRY_RUN) {
    console.log(`syndicate: [dry-run] would post ${item.link}`);
    continue;
  }
  await post(agent, item);
  console.log(`syndicate: posted ${item.link}`);
}
