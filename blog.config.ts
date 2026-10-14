import { envField } from "astro/config";

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

export const envSchema = {
  PUBLIC_WEBMENTION_IO_USERNAME: envField.string({
    access: "public",
    context: "client",
    optional: true,
  }),
};
