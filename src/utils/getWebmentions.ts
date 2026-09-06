import { getCollection } from "astro:content";
import { PUBLIC_WEBMENTION_IO_USERNAME } from "astro:env/client";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import postFilter from "@/utils/postFilter";

export type WebmentionAuthor = {
  name?: string;
  photo?: string;
  url?: string;
};

export type WebmentionEntry = {
  type: "entry";
  author?: WebmentionAuthor;
  url: string;
  published?: string;
  "wm-received": string;
  "wm-id": number;
  "wm-source": string;
  "wm-target": string;
  "wm-property":
    "in-reply-to" | "like-of" | "repost-of" | "mention-of" | "bookmark-of";
  "wm-private": boolean;
  content?: { html?: string };
};

export type Webmentions = {
  likes: WebmentionEntry[];
  reposts: WebmentionEntry[];
  replies: WebmentionEntry[];
  mentions: WebmentionEntry[];
};

const empty: Webmentions = {
  likes: [],
  reposts: [],
  replies: [],
  mentions: [],
};

const PER_PAGE = 100;

// webmention.io accepts repeated target[] params, so one request covers many
// posts. Chunked to keep the query string well inside the server's URL limit;
// each post contributes two spellings.
const TARGETS_PER_REQUEST = 30;

// webmention.io matches targets exactly, so a mention filed against one
// spelling of a URL is invisible to a query for the other.
function targetSpellings(target: string): string[] {
  return target.endsWith("/")
    ? [target, target.slice(0, -1)]
    : [target, `${target}/`];
}

// Both spellings of a target collapse to one key so a lookup finds mentions
// filed against either.
function targetKey(target: string): string {
  return target.endsWith("/") ? target.slice(0, -1) : target;
}

function mentionsUrl(spellings: string[], sinceId: number): string {
  const params = new URLSearchParams(
    spellings.map(spelling => ["target[]", spelling])
  );
  params.set("per-page", String(PER_PAGE));
  params.set("sort-dir", "up");
  params.set("since_id", String(sinceId));

  return `https://webmention.io/api/mentions.jf2?${params}`;
}

// Batching removes the burst that provokes webmention.io's 502s; these absorb
// the one that arrives anyway. Only a 429 or a 5xx earns a second attempt --
// any other status is an answer, and asking again returns the same one.
const MAX_ATTEMPTS = 3;
const RETRY_WAIT_MS = 1000;

function transient(status: number): boolean {
  return status === 429 || status >= 500;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(url: string, targets: number): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    // A throw here is a transport failure, which retries on the same terms as
    // a 5xx.
    const res = await fetch(url).catch(() => null);
    if (res?.ok) return res;

    const failure = res ? `${res.status}` : "transport failure";
    if (res && !transient(res.status)) {
      throw new Error(`Webmention fetch ${failure} for ${targets} targets`);
    }
    if (attempt === MAX_ATTEMPTS) {
      throw new Error(
        `Webmention fetch ${failure} for ${targets} targets after ${MAX_ATTEMPTS} attempts`
      );
    }

    await wait(RETRY_WAIT_MS * attempt);
  }
}

// webmention.io's since_id is a forward-only cursor (returns wm-id
// strictly greater, with no descending equivalent), so we fetch
// oldest-first and advance since_id past each batch.
async function fetchMentions(targets: string[]): Promise<WebmentionEntry[]> {
  const spellings = targets.flatMap(targetSpellings);
  const children: WebmentionEntry[] = [];
  let sinceId = 0;

  for (;;) {
    const res = await fetchPage(
      mentionsUrl(spellings, sinceId),
      targets.length
    );

    const data = (await res.json()) as { children?: WebmentionEntry[] };
    const batch = data.children ?? [];
    // End of data is an empty batch, not a short one: the server may cap
    // per-page, so a short page isn't a reliable end signal.
    if (batch.length === 0) return children;

    children.push(...batch);
    sinceId = Math.max(...batch.map(c => c["wm-id"]));
  }
}

async function fetchAllMentions(): Promise<Map<string, WebmentionEntry[]>> {
  const posts = await getCollection("blog", postFilter);
  const targets = posts.map(
    post => new URL(getPath(post.id, post.filePath), SITE.website).href
  );

  const byTarget = new Map<string, WebmentionEntry[]>();
  for (let i = 0; i < targets.length; i += TARGETS_PER_REQUEST) {
    const children = await fetchMentions(
      targets.slice(i, i + TARGETS_PER_REQUEST)
    );
    for (const child of children) {
      const key = targetKey(child["wm-target"]);
      byTarget.set(key, [...(byTarget.get(key) ?? []), child]);
    }
  }

  return byTarget;
}

// Every post page asks for its own mentions, but a request per page is a burst
// webmention.io answers with intermittent 502s. One pass over every target,
// memoised for the build, keeps the site to a single round of requests.
let allMentions: Promise<Map<string, WebmentionEntry[]>> | null = null;

function mentionsByTarget(): Promise<Map<string, WebmentionEntry[]>> {
  allMentions ??= fetchAllMentions();
  return allMentions;
}

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  const children = [
    ...((await mentionsByTarget()).get(targetKey(target)) ?? []),
  ];
  // The cursor forced oldest-first; restore newest-first for display.
  children.sort((a, b) => b["wm-id"] - a["wm-id"]);

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
