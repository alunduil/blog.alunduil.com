import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { renderPostBodies } from "@/utils/postBody";
import { useTranslations } from "@/i18n";
import config from "@/config";

export async function GET() {
  const reviews = getSortedPosts(await getCollection("reviews"));
  const contents = await renderPostBodies(reviews);
  const t = useTranslations(config.site.lang);

  return rss({
    title: `${t.pages.reviewsTitle} | ${config.site.title}`,
    description: t.pages.reviewsDesc,
    site: config.site.url,
    items: reviews.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      // The publication moment: an edit must not re-surface a review as unread.
      pubDate: data.pubDatetime,
      content: contents.get(id),
    })),
  });
}
