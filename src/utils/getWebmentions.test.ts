import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config";
import type { WebmentionEntry } from "./getWebmentions";

const env = vi.hoisted(() => ({ username: "alunduil" }));

vi.mock("astro:env/client", () => ({
  get PUBLIC_WEBMENTION_IO_USERNAME() {
    return env.username;
  },
}));

vi.mock("astro:content", async importOriginal => ({
  ...(await importOriginal<typeof import("astro:content")>()),
  getCollection: async () => [
    {
      id: "hello",
      filePath: "src/data/blog/hello.md",
      data: { pubDatetime: new Date(0), draft: false },
    },
  ],
}));

const target = new URL("/posts/hello", SITE.website).href;

// Each batch is served in descending wm-id order, so the cursor has to take
// the batch's max rather than its last entry.
function batch(size: number, firstId: number): WebmentionEntry[] {
  return Array.from({ length: size }, (_, i) => ({
    type: "entry" as const,
    url: `https://example.com/${firstId + i}`,
    "wm-received": "2026-01-01T00:00:00Z",
    "wm-id": firstId + i,
    "wm-source": `https://example.com/${firstId + i}`,
    "wm-target": target,
    "wm-property": "like-of" as const,
    "wm-private": false,
  })).reverse();
}

function serve(sizes: number[]) {
  let nextId = 1;
  const responses = sizes.map(size => {
    const children = batch(size, nextId);
    nextId += size;
    return new Response(JSON.stringify({ children }));
  });

  const fetch = vi.fn();
  for (const response of responses) fetch.mockResolvedValueOnce(response);
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

function requestedUrls(fetch: ReturnType<typeof vi.fn>): URL[] {
  return fetch.mock.calls.map(([url]) => new URL(url as string));
}

// The module memoises every post's mentions for the build; a fresh import per
// case keeps one case's responses out of the next.
async function getWebmentions(post: string) {
  const module = await import("./getWebmentions");
  return module.getWebmentions(post);
}

describe("getWebmentions", () => {
  beforeEach(() => {
    vi.resetModules();
    env.username = "alunduil";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps paging past a short batch until an empty one", async () => {
    const fetch = serve([100, 100, 30, 0]);

    const { likes } = await getWebmentions(target);

    expect(likes).toHaveLength(230);
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it("stops after the empty batch that follows a single one", async () => {
    const fetch = serve([30, 0]);

    const { likes } = await getWebmentions(target);

    expect(likes).toHaveLength(30);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("advances since_id to the highest wm-id seen", async () => {
    const fetch = serve([100, 100, 30, 0]);

    await getWebmentions(target);

    const urls = requestedUrls(fetch);
    expect(urls.map(url => url.searchParams.get("since_id"))).toEqual([
      "0",
      "100",
      "200",
      "230",
    ]);
    for (const url of urls) {
      expect(url.searchParams.getAll("target[]")).toEqual([
        target,
        `${target}/`,
      ]);
    }
  });

  it("returns mentions newest first", async () => {
    serve([100, 30, 0]);

    const { likes } = await getWebmentions(target);

    const ids = likes.map(like => like["wm-id"]);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
  });

  it("skips the fetch when no webmention.io account is configured", async () => {
    env.username = "";
    const fetch = serve([]);

    const { likes, reposts, replies, mentions } = await getWebmentions(target);

    expect([likes, reposts, replies, mentions]).toEqual([[], [], [], []]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
