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

// webmention.io matches targets exactly, so a mention filed against one
// spelling is invisible to a query for the other. Senders resolve to the
// canonical trailing-slash URL, while getPath builds the bare path.
function targetSpellings(target: string): string[] {
  return target.endsWith("/")
    ? [target, target.slice(0, -1)]
    : [target, `${target}/`];
}

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  // webmention.io's since_id is a forward-only cursor (returns wm-id
  // strictly greater, with no descending equivalent), so we fetch
  // oldest-first and advance since_id past each batch.
  const children: WebmentionEntry[] = [];
  let sinceId = 0;
  for (;;) {
    const params = new URLSearchParams(
      targetSpellings(target).map(spelling => ["target[]", spelling])
    );
    params.set("per-page", String(PER_PAGE));
    params.set("sort-dir", "up");
    params.set("since_id", String(sinceId));

    const url = `https://webmention.io/api/mentions.jf2?${params}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Webmention fetch ${res.status} for ${target}`);
    }

    const data = (await res.json()) as { children?: WebmentionEntry[] };
    const batch = data.children ?? [];
    // End of data is an empty batch, not a short one: the server may cap
    // per-page, so a short page isn't a reliable end signal.
    if (batch.length === 0) break;

    children.push(...batch);
    sinceId = Math.max(...batch.map(c => c["wm-id"]));
  }

  // The cursor forced oldest-first; restore newest-first for display.
  children.sort((a, b) => b["wm-id"] - a["wm-id"]);

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
