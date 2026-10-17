import { getCollection } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";

export { GET } from "../../posts/[...slug]/index.md";

export async function getStaticPaths() {
  const reviews = await getCollection("reviews", ({ data }) => !data.draft);
  return reviews.map(review => ({
    params: { slug: getPostSlug(review.id, review.filePath) },
    props: { post: review },
  }));
}
