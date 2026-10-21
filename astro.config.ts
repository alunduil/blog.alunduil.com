import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";
import { remarkPlugins } from "./src/utils/markdownPlugins";
import remarkMermaid from "./src/utils/remarkMermaid";
import rehypeThemeImages from "./src/utils/rehypeThemeImages";
import {
  bodyFont,
  brandFont,
  envSchema,
  redirects,
  shikiThemes,
} from "./blog.config";

export default defineConfig({
  site: config.site.url,
  redirects,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      // Shared with the RSS renderer, so feed and page match. Diagrams
      // render only on the page; the feed carries their source.
      remarkPlugins: [...remarkPlugins, remarkMermaid],
      rehypePlugins: [rehypeCallouts, rehypeThemeImages],
    }),
    shikiConfig: {
      themes: shikiThemes,
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Native bindings: the Mondrian OG cards render through resvg.
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
  fonts: [bodyFont, brandFont],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      ...envSchema,
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
