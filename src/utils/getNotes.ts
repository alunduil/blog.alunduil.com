import { type CollectionEntry, getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";
import { renderBody } from "./postBody";

/**
 * Published notes, newest first. A note is scheduled like a post: hidden
 * until its `pubDatetime`, less the scheduling margin, except in dev.
 */
export async function getSortedNotes(): Promise<CollectionEntry<"notes">[]> {
  const notes = await getCollection(
    "notes",
    ({ data }) =>
      import.meta.env.DEV ||
      Date.now() >
        data.pubDatetime.getTime() - config.posts.scheduledPostMargin
  );
  return notes.sort(
    (a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime()
  );
}

export function getNoteUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `notes/${id}`);
}

export function renderNoteBody({ id, body }: CollectionEntry<"notes">) {
  return renderBody(body ?? "", new URL(getNoteUrl(id), config.site.url));
}
