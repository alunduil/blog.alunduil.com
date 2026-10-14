import { envField, fontProviders } from "astro/config";
import type { AstroUserConfig } from "astro";
import { BRAND_FONT } from "./src/utils/loadBrandFonts";

/**
 * The blog's additions to astro.config.ts. Keeping them here leaves the
 * upstream AstroPaper config with one-line hooks, so upstream merges rarely
 * conflict on it.
 */

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

export const redirects = archivalRedirects(
  "best-practices-bind-mounts-and-chroots",
  "using-apc-to-speed-up-php",
  "using-memcached-with-mediawiki-and-wordpress"
);

// Only the header wordmark renders in this face, so the weight and subset
// lists stay narrow.
export const brandFont = {
  name: BRAND_FONT,
  cssVariable: "--font-brand",
  provider: fontProviders.google(),
  weights: [700],
  styles: ["normal"],
  subsets: ["latin"],
  fallbacks: ["sans-serif"],
} satisfies NonNullable<AstroUserConfig["fonts"]>[number];

export const envSchema = {
  // Public per-site beacon ID, created once by hand in the Cloudflare
  // dashboard (Web Analytics → add blog.alunduil.com). Leave Cloudflare's
  // automatic injection off: the beacon ships from BlogHead.astro, so edge
  // injection would double-count every pageview.
  PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN: envField.string({
    access: "public",
    context: "client",
    default: "3cda180b29054d619e163d6cafee3119",
  }),
  PUBLIC_WEBMENTION_IO_USERNAME: envField.string({
    access: "public",
    context: "client",
    optional: true,
  }),
};
