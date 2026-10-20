import { envField, fontProviders } from "astro/config";
import type { AstroUserConfig } from "astro";
import githubDark from "@shikijs/themes/github-dark-default";
import githubLight from "@shikijs/themes/github-light-default";
import { BRAND_FONT } from "./src/utils/loadBrandFonts";
import { COLORS } from "./src/utils/og-templates/mondrian";

/**
 * The blog's additions to astro.config.ts. Keeping them here leaves the
 * upstream AstroPaper config with one-line hooks, so upstream merges rarely
 * conflict on it.
 */

export { redirects } from "./src/utils/redirects";

export const bodyFont = {
  name: "IBM Plex Mono",
  cssVariable: "--font-body",
  provider: fontProviders.google(),
  weights: [400, 500, 600, 700],
  styles: ["normal", "italic"],
  subsets: ["latin"],
  fallbacks: ["monospace"],
} satisfies NonNullable<AstroUserConfig["fonts"]>[number];

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

// Cream drops two of GitHub's light colours below WCAG AA's 4.5:1, and
// the keyword red below it on a highlighted line, so each takes the next
// darker step on GitHub's Primer scale.
export const shikiThemes = {
  light: {
    ...githubLight,
    colorReplacements: {
      "#ffffff": COLORS.cream,
      "#6e7781": "#59636e",
      "#8250df": "#6639ba",
      "#cf222e": "#a40e26",
    },
  },
  dark: {
    ...githubDark,
    colorReplacements: { "#0d1117": COLORS.black },
  },
};

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
