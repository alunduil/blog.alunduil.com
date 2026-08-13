import { createMarkdownProcessor } from "@astrojs/markdown-remark";
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
 * Render a post body to HTML that stands alone outside the site.
 *
 * Images under `src/assets/` render unresolved: they reach the image service
 * through the page build, which this processor is no part of. See
 * `docs/reference/post-body.md`.
 */
export default async function renderPostBody(
  body: string,
  canonicalURL: URL
): Promise<string> {
  const processor = await processorPromise;
  const { code } = await processor.render(body);
  return absolutizeLinks(code, canonicalURL);
}
