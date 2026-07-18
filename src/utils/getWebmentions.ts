import { PUBLIC_WEBMENTION_IO_USERNAME } from "astro:env/client";

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
    | "in-reply-to"
    | "like-of"
    | "repost-of"
    | "mention-of"
    | "bookmark-of";
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

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  // Keyset pagination on wm-id (sort-dir=up, advancing since_id) rather
  // than page/per-page offsets: a mention added or removed on
  // webmention.io mid-fetch shifts every later offset, silently dropping
  // or duplicating a boundary entry. since_id tracks by ID, so surviving
  // entries never shift and strictly-greater guarantees no duplicates.
  // Terminate on an empty batch, not a short one: a short page would
  // assume the server honours our requested per-page, so a server-side
  // cap below PER_PAGE would silently stop us after the first batch.
  // per-page only bounds the request count; keep it high to minimise
  // build-time round-trips on posts with many mentions.
  const children: WebmentionEntry[] = [];
  let sinceId = 0;
  for (;;) {
    const url = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}&per-page=${PER_PAGE}&sort-dir=up&since_id=${sinceId}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Webmention fetch ${res.status} for ${target}`);
    }

    const data = (await res.json()) as { children?: WebmentionEntry[] };
    const batch = data.children ?? [];
    if (batch.length === 0) break;

    children.push(...batch);
    sinceId = Math.max(...batch.map(c => c["wm-id"]));
  }

  // sort-dir=up yields oldest-first; restore newest-first for display.
  children.sort((a, b) => b["wm-id"] - a["wm-id"]);

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
