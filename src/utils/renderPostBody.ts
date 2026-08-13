import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkPlugins } from "./markdownPlugins";

const processorPromise = createMarkdownProcessor({
  remarkPlugins,
  // Shiki carries its colours in CSS variables here (dual themes, no default
  // colour), and a feed reader supplies neither the stylesheet nor the
  // variables, so highlighting would arrive as markup around uncoloured text.
  syntaxHighlight: false,
});

const LINK_ATTRIBUTE = /(\s(?:href|src)=")([^"]*)(")/g;

/** Root-relative, excluding protocol-relative, or a bare fragment. */
const SITE_RELATIVE = /^(\/(?!\/)|#)/;

/**
 * Resolve site-relative URLs against the post's canonical URL. A feed reader
 * renders the item outside the site, where such a URL would otherwise resolve
 * against the reader's own document.
 */
function absolutizeLinks(html: string, canonicalURL: URL) {
  return html.replace(LINK_ATTRIBUTE, (attribute, prefix, url, suffix) =>
    SITE_RELATIVE.test(url)
      ? `${prefix}${new URL(url, canonicalURL).href}${suffix}`
      : attribute
  );
}

/**
 * Render a post body to HTML that stands alone outside the site.
 *
 * Images under `src/assets/` don't survive: they reach the image service
 * through the page build, not this processor, so their `@/assets/…` and
 * relative paths render unresolved. Post bodies use `public/` or remote images
 * instead (see `docs/reference/post-body.md`).
 */
export default async function renderPostBody(
  body: string,
  canonicalURL: URL
): Promise<string> {
  const processor = await processorPromise;
  const { code } = await processor.render(body);
  return absolutizeLinks(code, canonicalURL);
}
