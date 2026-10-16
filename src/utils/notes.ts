import { z } from "astro/zod";

/**
 * A note is short enough to syndicate whole and responds to at most one
 * source. A note without a source has nothing to generate a title from, so
 * it sets its own.
 */
export const noteSchema = z
  .object({
    pubDatetime: z.date(),
    title: z.string().optional(),
    source: z
      .object({
        url: z.url({ protocol: /^https?$/ }),
        title: z.string(),
        author: z.string().optional(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    timezone: z.string().optional(),
  })
  .refine(note => note.title !== undefined || note.source !== undefined, {
    message: "A note without a source needs a title",
    path: ["title"],
  });

export type NoteData = z.infer<typeof noteSchema>;

export function noteTitle({ title, source }: NoteData): string {
  if (title !== undefined) return title;
  if (source === undefined) {
    throw new Error("A note without a source needs a title");
  }
  return source.author
    ? `On ${source.author}'s "${source.title}"`
    : `On "${source.title}"`;
}
