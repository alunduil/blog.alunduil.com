import { describe, expect, it } from "vitest";
import type { Entry } from "./entries";
import { schemaOrgType } from "./postTypes";

const post = (type: string) =>
  ({ collection: "posts", data: { type } }) as Entry;

describe("schemaOrgType", () => {
  it("adds TechArticle to a how-to", () => {
    expect(schemaOrgType(post("how-to"))).toEqual([
      "BlogPosting",
      "TechArticle",
    ]);
  });

  it("keeps a story a plain BlogPosting", () => {
    expect(schemaOrgType(post("story"))).toBe("BlogPosting");
  });

  it("keeps a review a plain BlogPosting", () => {
    const review = { collection: "reviews", data: {} } as Entry;

    expect(schemaOrgType(review)).toBe("BlogPosting");
  });
});
