import { createMarkdownProcessor } from "@astrojs/markdown-remark";
// Node, which runs `scripts/`, resolves only explicit extensions.
import { remarkPlugins } from "./markdownPlugins.ts";

const processorPromise = createMarkdownProcessor({
  remarkPlugins,
  // The site's dual Shiki themes carry their colours in CSS variables a feed
  // reader never loads, so highlighting arrives as markup around plain text.
  syntaxHighlight: false,
});

/**
 * Render Markdown to HTML as the feeds carry it. Checks that measure a feed
 * render through this too, so they count what the feed sends.
 */
export async function renderFeedMarkdown(markdown: string): Promise<string> {
  const processor = await processorPromise;
  const { code } = await processor.render(markdown);
  return code;
}
