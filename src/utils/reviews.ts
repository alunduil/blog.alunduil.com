import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";
import config from "@/config";

export const REVIEWS_PATH = "src/content/reviews";

/**
 * A review carries every post field, so components that list and render
 * posts take either, plus the work under review and its cover.
 */
export const reviewSchema = ({ image }: SchemaContext) =>
  z.object({
    author: z.string().default(config.site.author),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    reviewed: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: image(),
    description: z.string(),
    canonicalURL: z.string().optional(),
    hideEditPost: z.boolean().optional(),
    timezone: z.string().optional(),
  });
