import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z
      .object({
        author: z.string().default(SITE.author),
        pubDatetime: z.date(),
        modDatetime: z.date().optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).default(["others"]),
        shape: z
          .enum(["essay", "practice", "review", "how-to", "note"])
          .default("essay"),
        reviewed: z.string().optional(),
        ogImage: image().or(z.string()).optional(),
        description: z.string(),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        timezone: z.string().optional(),
      })
      // A review without these degrades silently: no work named in the
      // structured data, and the dynamic OG card in place of the cover.
      .superRefine((data, ctx) => {
        if (data.shape !== "review") return;
        for (const field of ["reviewed", "ogImage"] as const) {
          if (!data[field]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: `\`${field}\` is required when \`shape: review\``,
            });
          }
        }
      }),
});

export const collections = { blog };
