import { z } from "astro/zod";

export const NOTES_PATH = "src/content/notes";

export const notesSection = {
  title: "Notes",
  description: "Short responses and passing thoughts.",
};

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

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

/**
 * Rendered HTML as one line of plain text, for metadata such as
 * `og:description` that would show markup and entities literally.
 */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, code: string) => {
      if (code.startsWith("#x") || code.startsWith("#X")) {
        return String.fromCodePoint(parseInt(code.slice(2), 16));
      }
      if (code.startsWith("#")) {
        return String.fromCodePoint(parseInt(code.slice(1), 10));
      }
      return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The source line as HTML, without an enclosing element. Callers insert it
 * raw, past Astro's escaping, so the source's fields are escaped here.
 */
export function sourceLine({
  url,
  title,
  author,
}: NonNullable<NoteData["source"]>): string {
  const by = author ? ` by ${escapeHtml(author)}` : "";
  return `On <a href="${escapeHtml(url)}">${escapeHtml(title)}</a>${by}`;
}
