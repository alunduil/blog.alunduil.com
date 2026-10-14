import { envField } from "astro/config";

/**
 * The blog's additions to astro.config.ts. Keeping them here leaves the
 * upstream AstroPaper config with one-line hooks, so upstream merges rarely
 * conflict on it.
 */

export const envSchema = {
  PUBLIC_WEBMENTION_IO_USERNAME: envField.string({
    access: "public",
    context: "client",
    optional: true,
  }),
};
