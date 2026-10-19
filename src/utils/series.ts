import type { CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { getSortedPosts } from "./getSortedPosts";

type Post = CollectionEntry<"posts">;

export const seriesSchema = z.enum(["how-i"]);

export type Series = z.infer<typeof seriesSchema>;

export const seriesInfo: Record<Series, { title: string; description: string }> =
  {
    "how-i": {
      title: "How I",
      description:
        "How I run a practice, written down again when the practice changes.",
    },
  };

/** The published entries of `series`, oldest first, so a sequel follows its original. */
export function seriesEntries(posts: Post[], series: Series): Post[] {
  return getSortedPosts(
    posts.filter(post => post.data.series === series)
  ).reverse();
}
