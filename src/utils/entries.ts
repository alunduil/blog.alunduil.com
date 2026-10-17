import { getCollection, type CollectionEntry } from "astro:content";
import { BLOG_PATH } from "@/content.config";
import { REVIEWS_PATH } from "./reviews";

/** A dated entry: anything that lists, tags, and feeds the way a post does. */
export type Entry = CollectionEntry<"posts" | "reviews">;

/** Each dated collection's source folder, keyed by the URL section it serves. */
const SECTIONS = { posts: BLOG_PATH, reviews: REVIEWS_PATH } as const;

/**
 * The URL section and source folder of the entry at `filePath`. Callers hold
 * only the path, so the folder decides; a missing path means a post.
 */
export function sectionOf(filePath: string | undefined) {
  const section: keyof typeof SECTIONS = filePath?.startsWith(
    `${REVIEWS_PATH}/`
  )
    ? "reviews"
    : "posts";
  return { section, base: SECTIONS[section] };
}

/** Every dated entry, for pages that interlace collections. */
export async function getEntries(
  filter: (entry: Entry) => boolean = () => true
): Promise<Entry[]> {
  const [posts, reviews] = await Promise.all([
    getCollection("posts"),
    getCollection("reviews"),
  ]);
  return [...posts, ...reviews].filter(filter);
}
