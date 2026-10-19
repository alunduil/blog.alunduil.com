import { z } from "astro/zod";
import type { Entry } from "./entries";

/**
 * A post's form: what it is, not what it's about. Required with no default,
 * so a post that omits it fails the build instead of landing as a story.
 */
export const postType = z.enum(["story", "practice", "how-to"]);

export type PostType = z.infer<typeof postType>;

/**
 * Every post stays a `BlogPosting`, because every post is one; declaring
 * `TechArticle` alone would drop a how-to out of the blog-post hierarchy.
 * `TechArticle` carries the how-tos rather than `HowTo`, which expects
 * machine-readable `step` values this blog's prose doesn't supply.
 */
const SCHEMA_TYPES: Record<PostType, string | string[]> = {
  story: "BlogPosting",
  practice: "BlogPosting",
  "how-to": ["BlogPosting", "TechArticle"],
};

/** The schema.org `@type` an entry's page declares in its JSON-LD. */
export function schemaTypeOf(entry: Entry) {
  return "type" in entry.data ? SCHEMA_TYPES[entry.data.type] : "BlogPosting";
}
