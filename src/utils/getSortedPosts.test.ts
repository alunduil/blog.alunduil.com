import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import getSortedPosts from "./getSortedPosts";

function post(
  id: string,
  pubDatetime: string,
  modDatetime?: string
): CollectionEntry<"blog"> {
  return {
    id,
    data: {
      pubDatetime: new Date(pubDatetime),
      modDatetime: modDatetime ? new Date(modDatetime) : undefined,
      draft: false,
    },
  } as CollectionEntry<"blog">;
}

describe("getSortedPosts", () => {
  it("orders on pubDatetime, ignoring a newer modDatetime", () => {
    const edited = post(
      "edited",
      "2020-01-01T08:00:00Z",
      "2026-01-01T08:00:00Z"
    );
    const recent = post("recent", "2025-01-01T08:00:00Z");

    expect(getSortedPosts([edited, recent]).map(p => p.id)).toEqual([
      "recent",
      "edited",
    ]);
  });
});
