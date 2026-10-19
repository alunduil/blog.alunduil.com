import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import config from "@/config";
import type { WebmentionEntry } from "./getWebmentions";

const env = vi.hoisted(() => ({ username: "alunduil" }));

const collections = vi.hoisted(() => ({
  posts: [] as unknown[],
  reviews: [] as unknown[],
  notes: [] as unknown[],
}));

vi.mock("astro:env/client", async importOriginal => ({
  ...(await importOriginal<typeof import("astro:env/client")>()),
  get PUBLIC_WEBMENTION_IO_USERNAME() {
    return env.username;
  },
}));

vi.mock("astro:content", async importOriginal => ({
  ...(await importOriginal<typeof import("astro:content")>()),
  getCollection: async (name: keyof typeof collections) => collections[name],
}));

const post = {
  id: "hello",
  filePath: "src/content/posts/hello.md",
  data: { pubDatetime: new Date(0), draft: false },
};

const target = new URL("/posts/hello", config.site.url).href;

// Highest wm-id first, so a cursor read from the last entry falls behind.
function batch(
  size: number,
  firstId: number,
  wmTarget = target
): WebmentionEntry[] {
  return Array.from({ length: size }, (_, i) => {
    const id = firstId + i;
    const source = `https://example.com/${id}`;
    return {
      type: "entry" as const,
      url: source,
      "wm-received": "2026-01-01T00:00:00Z",
      "wm-id": id,
      "wm-source": source,
      "wm-target": wmTarget,
      "wm-property": "like-of" as const,
      "wm-private": false,
    };
  }).reverse();
}

function batches(sizes: number[], wmTarget = target): WebmentionEntry[][] {
  let nextId = 1;
  return sizes.map(size => {
    const entries = batch(size, nextId, wmTarget);
    nextId += size;
    return entries;
  });
}

function serveBatches(sizes: number[], wmTarget = target) {
  const responses = batches(sizes, wmTarget).map(
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
    collections.posts = [post];
    collections.reviews = [];
    collections.notes = [];
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

  it("shows mentions filed against a moved page's old URL", async () => {
    collections.posts = [];
    collections.reviews = [
      { ...post, id: "atomfall", filePath: "src/content/reviews/atomfall.md" },
    ];
    const moved = new URL("/reviews/atomfall", config.site.url).href;
    const former = new URL("/posts/reviews/atomfall", config.site.url).href;
    const fetch = serveBatches([2, 0], `${former}/`);

    const { likes } = await getWebmentions(moved);

    expect(likes).toHaveLength(2);
    expect(requestedUrls(fetch)[0].searchParams.getAll("target[]")).toContain(
      former
    );
  });

  it("asks for mentions of notes", async () => {
    collections.posts = [];
    collections.notes = [
      {
        id: "aside",
        collection: "notes",
        filePath: "src/content/notes/aside.md",
        data: { pubDatetime: new Date(0) },
      },
    ];
    const note = new URL("/notes/aside", config.site.url).href;
    const fetch = serveBatches([2, 0], note);

    const { likes } = await getWebmentions(note);

    expect(likes).toHaveLength(2);
    expect(requestedUrls(fetch)[0].searchParams.getAll("target[]")).toContain(
      note
    );
  });

  it("skips the fetch when no webmention.io account is configured", async () => {
    env.username = "";
    const fetch = serveBatches([]);

    const { likes, reposts, replies, mentions } = await getWebmentions(target);

    expect([likes, reposts, replies, mentions]).toEqual([[], [], [], []]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
