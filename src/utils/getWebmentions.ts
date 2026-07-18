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

export async function getWebmentions(target: string): Promise<Webmentions> {
  if (!PUBLIC_WEBMENTION_IO_USERNAME) return empty;

  const url = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}&per-page=100`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Webmention fetch ${res.status} for ${target}`);
  }

  const data = (await res.json()) as { children?: WebmentionEntry[] };
  const children = data.children ?? [];

  return {
    likes: children.filter(c => c["wm-property"] === "like-of"),
    reposts: children.filter(c => c["wm-property"] === "repost-of"),
    replies: children.filter(c => c["wm-property"] === "in-reply-to"),
    mentions: children.filter(c => c["wm-property"] === "mention-of"),
  };
}
