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

function mentionsUrl(spellings: string[], sinceId: number): string {
  const params = new URLSearchParams(
    spellings.map(spelling => ["target[]", spelling])
  );
  params.set("per-page", String(PER_PAGE));
  params.set("sort-dir", "up");
  params.set("since_id", String(sinceId));

  return `https://webmention.io/api/mentions.jf2?${params}`;
}

// webmention.io's since_id is a forward-only cursor (returns wm-id
// strictly greater, with no descending equivalent), so we fetch
// oldest-first and advance since_id past each batch.
async function fetchMentions(target: string): Promise<WebmentionEntry[]> {
  const spellings = targetSpellings(target);
  const children: WebmentionEntry[] = [];
  let sinceId = 0;

  for (;;) {
    const res = await fetch(mentionsUrl(spellings, sinceId));
    if (!res.ok) {
      throw new Error(`Webmention fetch ${res.status} for ${target}`);
    }

    const data = (await res.json()) as { children?: WebmentionEntry[] };
    const batch = data.children ?? [];
    // End of data is an empty batch, not a short one: the server may cap
    // per-page, so a short page isn't a reliable end signal.
    if (batch.length === 0) return children;

    children.push(...batch);
    sinceId = Math.max(...batch.map(c => c["wm-id"]));
  }
}

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  const children = await fetchMentions(target);
  // The cursor forced oldest-first; restore newest-first for display.
  children.sort((a, b) => b["wm-id"] - a["wm-id"]);

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
