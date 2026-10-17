import rss from "@astrojs/rss";
import { getNoteUrl, getSortedNotes, renderNoteBody } from "@/utils/getNotes";
import { notesSection, noteTitle, sourceLine } from "@/utils/notes";
import config from "@/config";

/** Notes syndicate whole, so each item carries the body and source line. */
export async function GET() {
  const notes = await getSortedNotes();

  return rss({
    title: `${notesSection.title} | ${config.site.title}`,
    description: notesSection.description,
    site: config.site.url,
    items: await Promise.all(
      notes.map(async note => {
        const { data } = note;
        const html = await renderNoteBody(note);
        const content = data.source
          ? `${html}\n<p>${sourceLine(data.source)}</p>`
          : html;
        return {
          link: getNoteUrl(note.id),
          title: noteTitle(data),
          pubDate: data.pubDatetime,
          content,
        };
      })
    ),
  });
}
