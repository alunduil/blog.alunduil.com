import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const posts = getSortedPosts(await getCollection("blog"));

  const postLines = posts.map(({ data, id, filePath }) => {
    const url = new URL(`${getPath(id, filePath)}/index.md`, site).href;
    return `- [${data.title}](${url}): ${data.description}`;
  });

  const body = `# ${SITE.title}

> ${SITE.desc}

This is the personal blog of ${SITE.author}. Every post below is also available as clean Markdown at its \`index.md\` URL.

## Posts

${postLines.join("\n")}

## About

- [About](${new URL("about", site).href}): About the author.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
