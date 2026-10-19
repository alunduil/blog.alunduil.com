import rss from "@astrojs/rss";
import type { Entry } from "@/utils/entries";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { renderPostBodies } from "@/utils/postBody";
import config from "@/config";

/** RSS of the published `entries`, newest first, each with its full body. */
export async function postFeed(
  entries: Entry[],
  channel: { title: string; description: string }
) {
  const sorted = getSortedPosts(entries);
  const contents = await renderPostBodies(sorted);

  return rss({
    ...channel,
    site: config.site.url,
    items: sorted.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      // The publication moment: an edit must not re-surface an entry as unread.
      pubDate: data.pubDatetime,
      content: contents.get(id),
    })),
  });
}
