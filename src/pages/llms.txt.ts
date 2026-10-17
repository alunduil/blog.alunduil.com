import type { APIRoute } from "astro";
import { getEntries } from "@/utils/entries";
import { getPostUrl } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import config from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const posts = getSortedPosts(await getEntries());

  const postLines = posts.map(({ data, id, filePath }) => {
    const url = new URL("index.md", new URL(getPostUrl(id, filePath), site))
      .href;
    return `- [${data.title}](${url}): ${data.description}`;
  });

  const body = `# ${config.site.title}

> ${config.site.description}

This is the personal blog of ${config.site.author}. Every post below is also available as clean Markdown at its \`index.md\` URL.

## Posts

${postLines.join("\n")}

## About

- [About](${new URL("about", site).href}): About the author.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
