import type { Listing } from "@/utils/entries";
import { postFilter } from "./postFilter";

/**
 * Returns posts that are eligible to be shown to users, sorted by
 * `pubDatetime` descending, so an edit doesn't move a post back to the top.
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 */
export function getSortedPosts<T extends Listing>(posts: T[]) {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.pubDatetime).getTime() / 1000
        )
    );
}
