import { z } from "astro/zod";
import type { Entry, Listing } from "./entries";

export const postTypeSchema = z.enum(["story", "practice", "how-to"]);

/** The one-word type a listing row shows. */
export function listingType(listing: Listing): string {
  switch (listing.collection) {
    case "posts":
      return listing.data.type;
    case "reviews":
      return "review";
    case "notes":
      return "note";
  }
}

/**
 * `TechArticle` sits on a different `Article` branch from `BlogPosting`, so
 * a how-to declares both to stay a blog post.
 */
export function schemaOrgType(entry: Entry): string | string[] {
  return entry.collection === "posts" && entry.data.type === "how-to"
    ? ["BlogPosting", "TechArticle"]
    : "BlogPosting";
}
