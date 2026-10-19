import type { APIRoute } from "astro";
import { getListings, isNote, listingTitle } from "@/utils/entries";
import { getPostUrl } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { renderNoteBody } from "@/utils/getNotes";
import { plainText } from "@/utils/notes";
import config from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const posts = getSortedPosts(await getListings());

  const postLines = await Promise.all(
    posts.map(async post => {
      const page = new URL(getPostUrl(post.id, post.filePath), site);
      const [url, description] = isNote(post)
        ? [page.href, plainText(await renderNoteBody(post))]
        : [new URL("index.md", page).href, post.data.description];
      return `- [${listingTitle(post)}](${url}): ${description}`;
    })
  );

  const body = `# ${config.site.title}

> ${config.site.description}

This is the personal blog of ${config.site.author}. Posts and reviews below are also available as clean Markdown at their \`index.md\` URLs. Notes link to their pages.

## Posts

${postLines.join("\n")}

## About

- [About](${new URL("about", site).href}): About the author.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
