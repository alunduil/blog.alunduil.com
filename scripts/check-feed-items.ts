/**
 * Check that two builds of the site carry the same items in every RSS feed.
 *
 * dlvr.it posts each new feed item to social accounts, and a redeploy can't
 * recall a post.
 *
 *     node scripts/check-feed-items.ts <base-dist> <head-dist>
 */
import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { XMLParser } from "fast-xml-parser";

export type Feeds = Map<string, Set<string>>;

const parser = new XMLParser({
  isArray: name => name === "item",
  parseTagValue: false,
});

/** Each item's guid and link, or undefined when `xml` isn't an RSS feed. */
export function feedItems(xml: string): Set<string> | undefined {
  const channel = parser.parse(xml).rss?.channel;
  if (channel === undefined) return undefined;

  const items: { guid?: string; link?: string }[] = channel.item ?? [];
  return new Set(items.map(({ guid, link }) => `${guid} ${link}`));
}

/** A line for each item that only one build has. */
export function differences(base: Feeds, head: Feeds): string[] {
  if (base.size === 0) throw new Error("The base build has no RSS feeds");

  const paths = new Set([...base.keys(), ...head.keys()]);
  return [...paths].sort().flatMap(path => {
    const before = base.get(path) ?? new Set<string>();
    const after = head.get(path) ?? new Set<string>();
    return [
      ...[...after.difference(before)].map(item => `${path}: added ${item}`),
      ...[...before.difference(after)].map(item => `${path}: removed ${item}`),
    ];
  });
}

function readFeeds(root: string): Feeds {
  const feeds: Feeds = new Map();
  for (const path of globSync("**/*.xml", { cwd: root })) {
    const items = feedItems(readFileSync(join(root, path), "utf8"));
    if (items) feeds.set(path, items);
  }
  return feeds;
}

function main(roots: string[]): number {
  const [base, head] = roots.map(readFeeds);
  const changes = differences(base, head);

  for (const change of changes) process.stderr.write(`${change}\n`);
  process.stdout.write(`Compared ${head.size} feeds.\n`);
  return changes.length === 0 ? 0 : 1;
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
