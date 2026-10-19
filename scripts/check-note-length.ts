/**
 * Check that every note fits in one Bluesky post.
 *
 * dlvr.it posts a note's feed description, its plain-text body, as the whole
 * post. Bluesky caps a post at 300 characters and dlvr.it truncates anything
 * longer, so a note over the cap would go out cut short.
 *
 * Paths are relative to the repo root:
 *
 *     pnpm note-length:check
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { renderFeedMarkdown } from "../src/utils/feedMarkdown.ts";
import { NOTES_PATH, plainText } from "../src/utils/notes.ts";

// Bluesky counts graphemes, so an emoji or an accented letter is one.
const BLUESKY_LIMIT = 300;

const FRONTMATTER = /^---\n.*?\n---\n/s;

const graphemes = new Intl.Segmenter();

async function length(path: string): Promise<number> {
  const body = readFileSync(path, "utf8").replace(FRONTMATTER, "");
  const text = plainText(await renderFeedMarkdown(body));
  return [...graphemes.segment(text)].length;
}

async function main(): Promise<number> {
  const paths = readdirSync(NOTES_PATH)
    .filter(name => name.endsWith(".md"))
    .sort()
    .map(name => join(NOTES_PATH, name));

  const errors: string[] = [];
  for (const path of paths) {
    const count = await length(path);
    if (count > BLUESKY_LIMIT) {
      errors.push(
        `${path}: ${count} characters of plain text; Bluesky posts ${BLUESKY_LIMIT}`
      );
    }
  }

  for (const error of errors) process.stderr.write(`${error}\n`);
  return errors.length > 0 ? 1 : 0;
}

process.exitCode = await main();
