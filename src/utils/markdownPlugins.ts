import type { RemarkPlugins } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

/**
 * The site build and the RSS feed share this list, so a table of contents
 * renders the same in a feed reader as on the page.
 */
export const remarkPlugins: RemarkPlugins = [
  remarkToc,
  [remarkCollapse, { test: "Table of contents" }],
];
