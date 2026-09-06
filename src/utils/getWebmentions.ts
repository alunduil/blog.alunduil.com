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

type MentionsByTarget = Map<string, WebmentionEntry[]>;

const empty: Webmentions = {
  likes: [],
  reposts: [],
  replies: [],
  mentions: [],
};

const PER_PAGE = 100;

// webmention.io accepts repeated target[] params, so one request covers many
// posts. Chunked to keep the query string inside the server's URL limit; each
// post contributes two spellings.
const TARGETS_PER_REQUEST = 30;

// webmention.io matches targets exactly, so a mention filed against one
// spelling of a URL is invisible to a query for the other.
function canonicalTarget(target: string): string {
  return target.endsWith("/") ? target.slice(0, -1) : target;
}

function targetSpellings(target: string): string[] {
  const canonical = canonicalTarget(target);
  return [canonical, `${canonical}/`];
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size)
  );
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

// webmention.io answers intermittently with a 502; a repeat ask usually
// succeeds.
const MAX_ATTEMPTS = 3;
const RETRY_WAIT_MS = 1000;

// A status is an answer, and asking again returns the same one -- unless the
// server is saying it could not answer this time.
function retriable(status: number): boolean {
  return status === 429 || status >= 500;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(url: string, targetCount: number): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    // A rejected fetch never reached a status; treat it as a 5xx.
    const res = await fetch(url).catch(() => null);
    if (res?.ok) return res;

    const status = res ? String(res.status) : "transport failure";
    const failure = `Webmention fetch ${status} for ${targetCount} targets`;

    if (res && !retriable(res.status)) throw new Error(failure);
    if (attempt === MAX_ATTEMPTS) {
      throw new Error(`${failure} after ${MAX_ATTEMPTS} attempts`);
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

// Mirrors the target PostDetails.astro passes to getWebmentions. Should the
// two drift, a page looks itself up under a target nothing was filed against
// and renders nothing, with no error.
async function postTargets(): Promise<string[]> {
  const posts = await getCollection("blog", postFilter);

  return posts.map(
    post => new URL(getPath(post.id, post.filePath), SITE.website).href
  );
}

function groupByTarget(children: WebmentionEntry[]): MentionsByTarget {
  const byTarget: MentionsByTarget = new Map();

  for (const child of children) {
    const key = canonicalTarget(child["wm-target"]);
    const group = byTarget.get(key);

    if (group) group.push(child);
    else byTarget.set(key, [child]);
  }

  return byTarget;
}

async function fetchAllMentions(): Promise<MentionsByTarget> {
  const children: WebmentionEntry[] = [];

  // Sequential: webmention.io 502s when asked for many things at once.
  for (const batch of chunk(await postTargets(), TARGETS_PER_REQUEST)) {
    children.push(...(await fetchMentions(batch)));
  }

  return groupByTarget(children);
}

// Holds the promise rather than the result: pages render concurrently, so
// callers after the first join the request in flight instead of starting
// their own.
let allMentions: Promise<MentionsByTarget> | null = null;

function mentionsByTarget(): Promise<MentionsByTarget> {
  allMentions ??= fetchAllMentions();
  return allMentions;
}

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  const byTarget = await mentionsByTarget();
  // Copied before sorting: the map is shared by every page of the build.
  const children = [...(byTarget.get(canonicalTarget(target)) ?? [])];
  // The cursor forced oldest-first; restore newest-first for display.
  children.sort((a, b) => b["wm-id"] - a["wm-id"]);

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
