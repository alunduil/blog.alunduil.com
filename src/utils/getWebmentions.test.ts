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

// Highest wm-id first, so a cursor read from the last entry falls behind.
function batch(size: number, firstId: number): WebmentionEntry[] {
  return Array.from({ length: size }, (_, i) => {
    const id = firstId + i;
    const source = `https://example.com/${id}`;
    return {
      type: "entry" as const,
      url: source,
      "wm-received": "2026-01-01T00:00:00Z",
      "wm-id": id,
      "wm-source": source,
      "wm-target": target,
      "wm-property": "like-of" as const,
      "wm-private": false,
    };
  }).reverse();
}

function batches(sizes: number[]): WebmentionEntry[][] {
  let nextId = 1;
  return sizes.map(size => {
    const entries = batch(size, nextId);
    nextId += size;
    return entries;
  });
}

function serveBatches(sizes: number[]) {
  const responses = batches(sizes).map(
    children => new Response(JSON.stringify({ children }))
  );
  const fetch = vi.fn<(url: string) => Promise<Response | undefined>>(
    async () => responses.shift()
  );
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

function requestedUrls(fetch: ReturnType<typeof serveBatches>): URL[] {
  return fetch.mock.calls.map(([url]) => new URL(url));
}

// The module caches mentions for the whole build, so each case imports a
// fresh copy.
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

  it.each([
    { name: "past a short batch", sizes: [100, 100, 30, 0] },
    { name: "after a single batch", sizes: [30, 0] },
  ])("keeps paging $name until an empty batch", async ({ sizes }) => {
    const fetch = serveBatches(sizes);

    const { likes } = await getWebmentions(target);

    expect(likes).toHaveLength(sizes.reduce((sum, size) => sum + size, 0));
    expect(fetch).toHaveBeenCalledTimes(sizes.length);
  });

  it("advances since_id to the highest wm-id seen", async () => {
    const fetch = serveBatches([100, 100, 30, 0]);

    await getWebmentions(target);

    expect(
      requestedUrls(fetch).map(url => url.searchParams.get("since_id"))
    ).toEqual(["0", "100", "200", "230"]);
  });

  it("asks for both spellings of the target on every page", async () => {
    const fetch = serveBatches([100, 30, 0]);

    await getWebmentions(target);

    for (const url of requestedUrls(fetch)) {
      expect(url.searchParams.getAll("target[]")).toEqual([
        target,
        `${target}/`,
      ]);
    }
  });

  it("returns mentions newest first", async () => {
    serveBatches([100, 30, 0]);

    const { likes } = await getWebmentions(target);

    const ids = likes.map(like => like["wm-id"]);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
  });

  it("skips the fetch when no webmention.io account is configured", async () => {
    env.username = "";
    const fetch = serveBatches([]);

    const { likes, reposts, replies, mentions } = await getWebmentions(target);

    expect([likes, reposts, replies, mentions]).toEqual([[], [], [], []]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
