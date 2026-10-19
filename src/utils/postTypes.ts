import { z } from "astro/zod";
import type { Entry } from "./entries";

export const postTypeSchema = z.enum(["story", "practice", "how-to"]);

/**
 * `TechArticle` sits on a different `Article` branch from `BlogPosting`, so
 * a how-to declares both to stay a blog post.
 */
export function schemaOrgType(entry: Entry): string | string[] {
  return entry.collection === "posts" && entry.data.type === "how-to"
    ? ["BlogPosting", "TechArticle"]
    : "BlogPosting";
}
