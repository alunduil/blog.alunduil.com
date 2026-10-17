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

/**
 * Reviews that lived at `/posts/reviews/<slug>/` before they moved into their
 * own collection. A review written after the move has no old URL to redirect.
 */
const reviewRedirects = (...slugs: string[]) =>
  Object.fromEntries(
    slugs.map(s => [`/posts/reviews/${s}/`, `/reviews/${s}/`])
  );

export const redirects = {
  ...archivalRedirects(
    "best-practices-bind-mounts-and-chroots",
    "using-apc-to-speed-up-php",
    "using-memcached-with-mediawiki-and-wordpress"
  ),
  ...reviewRedirects(
    "atomfall",
    "gathering-colour",
    "hell-is-us",
    "keeper",
    "orconomics",
    "sanderson-secret-projects",
    "senuas-saga-hellblade-ii",
    "son-of-a-liche",
    "tales-from-earthsea",
    "the-invincible",
    "the-sicilian"
  ),
};
