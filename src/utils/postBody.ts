import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { CollectionEntry } from "astro:content";
import config from "@/config";
import { getPostUrl } from "./getPostPaths";
import { remarkPlugins } from "./markdownPlugins";

const processorPromise = createMarkdownProcessor({
  remarkPlugins,
  // The site's dual Shiki themes carry their colours in CSS variables a feed
  // reader never loads, so highlighting arrives as markup around plain text.
  syntaxHighlight: false,
});

const LINK_ATTRIBUTE = /(\s(?:href|src)=")([^"]*)(")/g;

/** Root-relative or a bare fragment; a protocol-relative `//host` is absolute. */
const SITE_RELATIVE = /^(\/(?!\/)|#)/;

/**
 * A feed reader renders the item outside the site, so a site-relative URL
 * would otherwise resolve against the reader's own document.
 */
function absolutizeLinks(html: string, canonicalURL: URL) {
  return html.replace(LINK_ATTRIBUTE, (attribute, prefix, url, suffix) =>
    SITE_RELATIVE.test(url)
      ? `${prefix}${new URL(url, canonicalURL).href}${suffix}`
      : attribute
  );
}

/**
 * A post's body as Markdown, for outputs that serve or parse it as such. An
 * MDX body is source: its imports and components would pass through verbatim.
 */
export function markdownBody({ body, filePath }: CollectionEntry<"posts">) {
  if (filePath?.endsWith(".mdx")) {
    throw new Error(`MDX can't be served as Markdown yet: ${filePath}`);
  }
  return body ?? "";
}

/**
 * Render each post's body to HTML that stands alone outside the site, keyed
 * by post id.
 *
 * Images under `src/assets/` render unresolved: they reach the image service
 * through the page build, which this processor is no part of. See
 * `docs/reference/post-body.md`.
 */
export async function renderPostBodies(
  posts: CollectionEntry<"posts">[]
): Promise<Map<string, string>> {
  const processor = await processorPromise;
  const rendered = await Promise.all(
    posts.map(async post => {
      const canonicalURL = new URL(
        getPostUrl(post.id, post.filePath),
        config.site.url
      );
      const { code } = await processor.render(markdownBody(post));
      return [post.id, absolutizeLinks(code, canonicalURL)] as const;
    })
  );
  return new Map(rendered);
}
