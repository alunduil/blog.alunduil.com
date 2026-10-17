import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { noteSchema } from "./notes";

/**
 * Collections the blog adds to AstroPaper's. Adding one here leaves the
 * upstream `src/content.config.ts` unchanged.
 */
export const blogCollections = {
  notes: defineCollection({
    loader: glob({ pattern: "[^_]*.md", base: "./src/content/notes" }),
    schema: noteSchema,
  }),
};
