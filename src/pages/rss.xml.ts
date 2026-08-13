import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import renderPostBody from "@/utils/renderPostBody";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: await Promise.all(
      sortedPosts.map(async post => {
        const link = getPath(post.id, post.filePath);
        // The trailing slash matches the item link `@astrojs/rss` emits, so
        // fragment links in the body point at the same URL subscribers land on.
        const canonicalURL = new URL(`${link}/`, SITE.website);
        return {
          link,
          title: post.data.title,
          description: post.data.description,
          pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
          content: await renderPostBody(post, canonicalURL),
        };
      })
    ),
  });
}
