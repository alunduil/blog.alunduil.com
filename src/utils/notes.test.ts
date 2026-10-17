import { describe, expect, it } from "vitest";
import { noteSchema, noteTitle, plainText, sourceLine } from "./notes";

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

describe("plainText", () => {
  it("drops markup and decodes entities", () => {
    expect(
      plainText(
        `<blockquote>\n<p>Outages are PvE &#x26; breaches are PvP.</p>\n</blockquote>\n<p>A <a href="/x">reply</a>.</p>`
      )
    ).toBe("Outages are PvE & breaches are PvP. A reply.");
  });
});

describe("sourceLine", () => {
  it("escapes the source's text and URL", () => {
    expect(
      sourceLine({
        url: 'https://example.com/a?b=1&c="2"',
        title: "The <dialog> element, a *primer* [draft]",
        author: "A & B",
      })
    ).toBe(
      `On <a href="https://example.com/a?b=1&amp;c=&quot;2&quot;">The &lt;dialog&gt; element, a *primer* [draft]</a> by A &amp; B`
    );
  });
});
