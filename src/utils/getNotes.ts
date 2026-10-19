import { type CollectionEntry, getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";
import { getSortedPosts } from "./getSortedPosts";
import { renderBody } from "./postBody";

/** Published notes, newest first. */
export async function getSortedNotes(): Promise<CollectionEntry<"notes">[]> {
  return getSortedPosts(await getCollection("notes"));
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
