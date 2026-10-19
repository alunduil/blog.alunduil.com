import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { seriesEntries } from "./series";

const post = (
  id: string,
  pubDatetime: string,
  data: { series?: string; draft?: boolean } = {}
) =>
  ({
    id,
    collection: "posts",
    data: { pubDatetime: new Date(pubDatetime), ...data },
  }) as CollectionEntry<"posts">;

describe("seriesEntries", () => {
  it("lists only members, oldest first", () => {
    const posts = [
      post("sequel", "2026-05-18T07:00:00Z", { series: "how-i" }),
      post("other", "2026-01-01T07:00:00Z"),
      post("original", "2018-01-21T14:00:00Z", { series: "how-i" }),
    ];

    expect(seriesEntries(posts, "how-i").map(p => p.id)).toEqual([
      "original",
      "sequel",
    ]);
  });

  it("leaves out a draft member", () => {
    const draft = post("draft", "2026-01-01T07:00:00Z", {
      series: "how-i",
      draft: true,
    });

    expect(seriesEntries([draft], "how-i")).toEqual([]);
  });
});
