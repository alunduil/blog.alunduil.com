import { z } from "astro/zod";

/**
 * A post's form: what it is, not what it's about. Required with no default,
 * so a post that omits it fails the build instead of landing as a story.
 */
export const postType = z.enum(["story", "practice", "how-to"]);

export type PostType = z.infer<typeof postType>;
