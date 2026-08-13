import type { RemarkPlugins } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

/**
 * Remark plugins applied to post bodies.
 *
 * Shared between the site build and the RSS feed's `content:encoded`, so a
 * table of contents renders the same way in a feed reader as on the page.
 */
export const remarkPlugins: RemarkPlugins = [
  remarkToc,
  [remarkCollapse, { test: "Table of contents" }],
];
