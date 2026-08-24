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
 * Redirects to a restored post from the URL its original engine served it
 * at.
 *
 * Nikola and Hakyll both served `/posts/<slug>.html`, AstroPaper serves
 * `/posts/<slug>/`, and search engines still hold the old form. A static
 * build writes each redirect to `dist/posts/<slug>.html/index.html`, which
 * GitHub Pages reaches by redirecting the extension-less request to the
 * trailing-slash form; the page there carries a meta refresh, a canonical
 * link, and `noindex`.
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
