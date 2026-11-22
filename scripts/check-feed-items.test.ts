import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";
import { differences, feedItems, type Feeds } from "./check-feed-items";

const item = (link: string, guid = link) =>
  `<item><title>1</title><link>${link}</link><guid isPermaLink="true">${guid}</guid></item>`;
const rss = (...items: string[]) =>
  `<rss version="2.0"><channel><title>t</title><link>https://b/</link>${items.join("")}</channel></rss>`;
const feeds = (entries: Record<string, string[]>): Feeds =>
  new Map(
    Object.entries(entries).map(([path, items]) => [path, new Set(items)])
  );

describe("feedItems", () => {
  it("reads each item's guid and link, leaving out the channel's link", () => {
    expect(feedItems(rss(item("https://b/1/"), item("https://b/2/")))).toEqual(
      new Set(["https://b/1/ https://b/1/", "https://b/2/ https://b/2/"])
    );
  });

  it("reads a feed with a single item", () => {
    expect(feedItems(rss(item("https://b/1/")))?.size).toBe(1);
  });

  it("reads an empty feed as a feed", () => {
    expect(feedItems(rss())).toEqual(new Set());
  });

  it("keeps items whose guids are the same number", () => {
    const xml = rss(item("https://b/", "1"), item("https://b/", "1.0"));

    expect(feedItems(xml)?.size).toBe(2);
  });

  it("ignores XML that isn't a feed", () => {
    expect(feedItems("<urlset><url><loc>x</loc></url></urlset>")).toBe(
      undefined
    );
  });
});

describe("differences", () => {
  it("is empty when every feed's items match", () => {
    const build = { "rss.xml": ["a", "b"], "notes/rss.xml": ["n"] };

    expect(differences(feeds(build), feeds(build))).toEqual([]);
  });

  it("lists an added and a removed item", () => {
    expect(
      differences(feeds({ "rss.xml": ["a"] }), feeds({ "rss.xml": ["b"] }))
    ).toEqual(["rss.xml: added b", "rss.xml: removed a"]);
  });

  it("lists every item of a dropped or new feed", () => {
    expect(
      differences(feeds({ "old.xml": ["a"] }), feeds({ "new.xml": ["b"] }))
    ).toEqual(["new.xml: added b", "old.xml: removed a"]);
  });

  it("rejects a base build without feeds", () => {
    expect(() => differences(feeds({}), feeds({}))).toThrow("no RSS feeds");
  });
});

describe("the script", () => {
  const build = {
    "rss.xml": rss(item("https://b/1/")),
    "notes/rss.xml": rss(item("https://b/2/")),
    "sitemap.xml": "<urlset><url><loc>x</loc></url></urlset>",
  };

  function dist(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), "feed-items-"));
    onTestFinished(() => rmSync(root, { recursive: true }));
    for (const [path, xml] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), xml);
    }
    return root;
  }

  const run = (base: Record<string, string>, head: Record<string, string>) =>
    spawnSync(
      process.execPath,
      [
        join(import.meta.dirname, "check-feed-items.ts"),
        dist(base),
        dist(head),
      ],
      { encoding: "utf8" }
    );

  it("exits 0 when the builds' feeds match", () => {
    const { status, stdout } = run(build, build);

    expect(stdout).toBe("Compared 2 feeds.\n");
    expect(status).toBe(0);
  });

  it("exits 1 and names the item that only the head build has", () => {
    const { status, stderr } = run(build, {
      ...build,
      "notes/rss.xml": rss(item("https://b/2/"), item("https://b/3/")),
    });

    expect(stderr).toBe("notes/rss.xml: added https://b/3/ https://b/3/\n");
    expect(status).toBe(1);
  });
});
