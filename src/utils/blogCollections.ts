import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { NOTES_PATH, noteSchema } from "./notes";
import { REVIEWS_PATH, reviewSchema } from "./reviews";

/**
 * Collections the blog adds to AstroPaper's. Adding one here leaves the
 * upstream `src/content.config.ts` unchanged.
 */
export const blogCollections = {
  notes: defineCollection({
    loader: glob({ pattern: "[^_]*.md", base: `./${NOTES_PATH}` }),
    schema: noteSchema,
  }),
  reviews: defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${REVIEWS_PATH}` }),
    schema: reviewSchema,
  }),
};
