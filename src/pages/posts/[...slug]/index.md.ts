import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";
import { markdownBody } from "@/utils/postBody";

export async function getStaticPaths() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: CollectionEntry<"posts"> };
  return new Response(`# ${post.data.title}\n\n${markdownBody(post)}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
