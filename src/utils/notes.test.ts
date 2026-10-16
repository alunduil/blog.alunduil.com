import { describe, expect, it } from "vitest";
import { noteSchema, noteTitle } from "./notes";

const pubDatetime = new Date("2026-11-03T08:00:00Z");
const source = {
  url: "https://example.com/incidents",
  title: "Why Security Incidents Feel Different from Outages",
};

describe("noteSchema", () => {
  it("rejects a note with neither a title nor a source", () => {
    const result = noteSchema.safeParse({ pubDatetime });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["title"]);
  });

  it("accepts a sourceless note with a title", () => {
    expect(
      noteSchema.safeParse({ pubDatetime, title: "A thought" }).success
    ).toBe(true);
  });

  it("accepts a sourced note without a title", () => {
    expect(noteSchema.safeParse({ pubDatetime, source }).success).toBe(true);
  });
});

describe("noteTitle", () => {
  it("prefers the author's title over the source", () => {
    expect(noteTitle({ pubDatetime, tags: [], title: "Mine", source })).toBe(
      "Mine"
    );
  });

  it("names the source and its author", () => {
    expect(
      noteTitle({
        pubDatetime,
        tags: [],
        source: { ...source, author: "Art Kondratiev" },
      })
    ).toBe(
      `On Art Kondratiev's "Why Security Incidents Feel Different from Outages"`
    );
  });

  it("names the source alone when it has no author", () => {
    expect(noteTitle({ pubDatetime, tags: [], source })).toBe(
      `On "Why Security Incidents Feel Different from Outages"`
    );
  });
});

describe("noteSchema source", () => {
  it("rejects a source URL that isn't http or https", () => {
    expect(
      noteSchema.safeParse({
        pubDatetime,
        source: { ...source, url: "javascript:alert(1)" },
      }).success
    ).toBe(false);
  });
});
