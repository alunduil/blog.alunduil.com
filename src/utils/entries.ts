import { getCollection, type CollectionEntry } from "astro:content";
import { BLOG_PATH } from "@/content.config";
import { NOTES_PATH } from "./notes";
import { REVIEWS_PATH } from "./reviews";

/** A dated entry: anything that lists, tags, and feeds the way a post does. */
export type Entry = CollectionEntry<"posts" | "reviews">;

export type Note = CollectionEntry<"notes">;

/**
 * Anything the shared listings show. A note has no description and no
 * visible title, so it renders apart from an `Entry`.
 */
export type Listing = Entry | Note;

export function isNote(listing: Listing): listing is Note {
  return listing.collection === "notes";
}

/** Each collection's source folder, keyed by the URL section it serves. */
const SECTIONS = {
  posts: BLOG_PATH,
  reviews: REVIEWS_PATH,
  notes: NOTES_PATH,
} as const;

type Section = keyof typeof SECTIONS;

/**
 * The URL section and source folder of the entry at `filePath`. Callers hold
 * only the path, so the folder decides; a missing path means a post.
 */
export function sectionOf(filePath: string | undefined) {
  const section =
    (Object.keys(SECTIONS) as Section[]).find(key =>
      filePath?.startsWith(`${SECTIONS[key]}/`)
    ) ?? "posts";
  return { section, base: SECTIONS[section] };
}

/** Every post, review, and note, for pages that list all the writing. */
export async function getListings(): Promise<Listing[]> {
  const [posts, reviews, notes] = await Promise.all([
    getCollection("posts"),
    getCollection("reviews"),
    getCollection("notes"),
  ]);
  return [...posts, ...reviews, ...notes];
}
