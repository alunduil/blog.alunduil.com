import { describe, expect, it } from "vitest";
import type { Entry, Listing } from "./entries";
import { listingType, schemaOrgType } from "./postTypes";

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

describe("listingType", () => {
  it("shows a post's declared type", () => {
    expect(listingType(post("practice"))).toBe("practice");
  });

  it("names a review by its collection", () => {
    const review = { collection: "reviews", data: {} } as Listing;

    expect(listingType(review)).toBe("review");
  });

  it("names a note by its collection", () => {
    const note = { collection: "notes", data: {} } as Listing;

    expect(listingType(note)).toBe("note");
  });
});
