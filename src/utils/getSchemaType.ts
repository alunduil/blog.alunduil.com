import type { CollectionEntry } from "astro:content";

type Shape = CollectionEntry<"blog">["data"]["shape"];

/**
 * Map a post's shape to the schema.org type(s) it declares.
 *
 * Every post stays a `BlogPosting`, because every post is one. The shape adds
 * a second type where one applies: `Review` sits directly under
 * `CreativeWork`, and `TechArticle` under `Article`, so declaring either
 * alone would drop the page out of the blog-post hierarchy that listing and
 * search tools read.
 *
 * `TechArticle` carries the how-tos rather than `HowTo`, which expects
 * machine-readable `step` values this blog's prose doesn't supply.
 */
const SCHEMA_TYPE: Record<Shape, string | string[]> = {
  essay: "BlogPosting",
  practice: "BlogPosting",
  note: "BlogPosting",
  "how-to": ["BlogPosting", "TechArticle"],
  review: ["BlogPosting", "Review"],
};

export function getSchemaType(shape: Shape) {
  return SCHEMA_TYPE[shape];
}
