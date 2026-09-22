import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) => b.data.pubDatetime.valueOf() - a.data.pubDatetime.valueOf()
    );
};

export default getSortedPosts;
