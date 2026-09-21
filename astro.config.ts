import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mermaid from "astro-mermaid";
import { remarkPlugins } from "./src/utils/markdownPlugins";
import rehypeThemeImages from "./src/utils/rehypeThemeImages";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { BRAND_FONT, SITE } from "./src/config";

/**
 * Nikola and Hakyll served posts at `/posts/<slug>.html`, and search
 * engines still send traffic there.
 *
 * A static build writes each redirect into a directory named for the old
 * URL, `dist/posts/<slug>.html/index.html`. GitHub Pages reaches it by
 * redirecting the extension-less request to the trailing-slash form.
 */
const archivalRedirects = (...slugs: string[]) =>
  Object.fromEntries(slugs.map(s => [`/posts/${s}.html`, `/posts/${s}/`]));

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  redirects: archivalRedirects(
    "best-practices-bind-mounts-and-chroots",
    "using-apc-to-speed-up-php",
    "using-memcached-with-mediawiki-and-wordpress"
  ),
  integrations: [
    // Logging defaults on, chattering to the console on every page load.
    // Errors report regardless.
    mermaid({ enableLog: false }),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  // Only the header wordmark renders in this face, so the weight and subset
  // lists stay narrow.
  fonts: [
    {
      name: BRAND_FONT,
      cssVariable: "--font-brand",
      provider: fontProviders.google(),
      weights: [700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],
  markdown: {
    remarkPlugins,
    // Page-only, unlike the shared `remarkPlugins`: a feed reader has no site
    // theme, so it keeps the light variant.
    rehypePlugins: [rehypeThemeImages],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
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
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      PUBLIC_WEBMENTION_IO_USERNAME: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
