import type { CollectionEntry } from "astro:content";

type Shape = CollectionEntry<"blog">["data"]["shape"];

/**
 * Map a post's shape to the schema.org type that describes it.
 *
 * `TechArticle` carries the how-tos rather than `HowTo`, which expects
 * machine-readable `step` values this blog's prose doesn't supply.
 */
const SCHEMA_TYPE: Record<Shape, string> = {
  essay: "BlogPosting",
  practice: "BlogPosting",
  note: "BlogPosting",
  "how-to": "TechArticle",
  review: "Review",
};

export function getSchemaType(shape: Shape) {
  return SCHEMA_TYPE[shape];
}
