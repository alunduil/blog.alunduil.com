import { getCollection } from "astro:content";
import { postFeed } from "@/utils/postFeed";
import config from "@/config";

export async function GET() {
  return postFeed(
    await getCollection("posts", ({ data }) => data.linkedin),
    { title: config.site.title, description: config.site.description }
  );
}
