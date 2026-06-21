import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: getPath(post.id, post.filePath, false) },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };
  return new Response(`# ${post.data.title}\n\n${post.body}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
