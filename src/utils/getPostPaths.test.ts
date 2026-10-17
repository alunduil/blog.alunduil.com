import { describe, expect, it } from "vitest";
import { getPostSlug, getPostUrl } from "./getPostPaths";

describe("getPostUrl", () => {
  it.each([
    ["src/content/posts/hello.md", "/posts/hello/"],
    ["src/content/posts/_hakyll/hello.md", "/posts/hello/"],
    ["src/content/reviews/hello.md", "/reviews/hello/"],
  ])("serves %s under its collection's section", (filePath, url) => {
    expect(getPostUrl("hello", filePath)).toBe(url);
  });

  it("keeps the section out of the route param", () => {
    expect(getPostSlug("hello", "src/content/reviews/hello.md")).toBe("/hello");
  });
});
