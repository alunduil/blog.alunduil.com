/**
 * Check the scheduling convention on current-era blog posts.
 *
 * Two rules from `docs/reference/post-frontmatter.md` (Scheduling): every
 * post's `pubDatetime` is unique, and it publishes on a Tuesday or a Sunday.
 * Uniqueness is a property of the collection, so the Astro schema, which
 * validates one file at a time, can't carry it.
 *
 * Archival republishes under `src/data/blog/_<engine>/` are historical text,
 * not scheduled writing. Both this check and the collection skip them on the
 * leading underscore.
 *
 * Run from the repo root:
 *
 *     node scripts/check-post-scheduling.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, sep } from "node:path";

import { parse } from "yaml";

import { SITE } from "../src/config.ts";

// src/content.config.ts exports this path and the underscore rule, but it
// also imports astro:content, a virtual module that resolves only inside an
// Astro build. Both are restated here rather than imported.
const BLOG = "src/data/blog";

const SCHEDULED_WEEKDAYS = new Set(["Tuesday", "Sunday"]);

// en-GB renders Europe/London as BST, the abbreviation every in-scope post
// carries. Other locales fall back to a GMT offset for it.
const LOCALE = "en-GB";

// Published on a Monday, two months before the weekday convention existed.
// Its pubDatetime already went out over RSS, so it stays as posted.
const WEEKDAY_EXEMPT = new Set([join(BLOG, "how-i-read-eight-years-on.md")]);

const FRONTMATTER = /^---\n(.*?)\n---\n/s;
const UTC_OFFSET = /(Z|[+-]\d{2}:\d{2})$/;

interface Post {
  path: string;
  instant: Date;
  // null when `timezone` names no zone that resolves. A collision is still
  // caught in that case, because it compares instants; only the weekday
  // needs the local reading.
  zone: string | null;
}

function inScope(relative: string): boolean {
  return !relative.split(sep).some(part => part.startsWith("_"));
}

function postPaths(): string[] {
  return readdirSync(BLOG, { recursive: true, encoding: "utf8" })
    .filter(relative => relative.endsWith(".md") && inScope(relative))
    .sort()
    .map(relative => join(BLOG, relative));
}

function isIanaZone(name: string): boolean {
  try {
    // Constructed for the throw; the locale is irrelevant to the zone check.
    new Intl.DateTimeFormat(undefined, { timeZone: name });
    return true;
  } catch {
    return false;
  }
}

function frontmatter(path: string): Record<string, unknown> {
  const match = FRONTMATTER.exec(readFileSync(path, "utf8"));
  if (match === null) return {};
  return (parse(match[1]) as Record<string, unknown> | null) ?? {};
}

/** The instant as the post's own zone renders it, e.g. `Sunday 2026-08-09 08:00 BST`. */
function localStamp(
  instant: Date,
  zone: string
): { weekday: string; text: string } {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone: zone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).formatToParts(instant);

  const part = (type: string) => parts.find(p => p.type === type)?.value ?? "";
  const weekday = part("weekday");
  const date = `${part("year")}-${part("month")}-${part("day")}`;

  return {
    weekday,
    text: `${weekday} ${date} ${part("hour")}:${part("minute")} ${part("timeZoneName")}`,
  };
}

function readPosts(): { posts: Post[]; errors: string[] } {
  const posts: Post[] = [];
  const errors: string[] = [];

  for (const path of postPaths()) {
    const front = frontmatter(path);
    const published = front.pubDatetime;

    if (typeof published !== "string" || !UTC_OFFSET.test(published)) {
      errors.push(`${path}: pubDatetime is missing or carries no UTC offset`);
      continue;
    }

    const instant = new Date(published);
    if (Number.isNaN(instant.getTime())) {
      errors.push(`${path}: pubDatetime ${published} is not a valid timestamp`);
      continue;
    }

    // 08:00 local can land on a different day in UTC, so the weekday is only
    // right when read in the post's own zone.
    const named = String(front.timezone ?? SITE.timezone);
    const zone = isIanaZone(named) ? named : null;
    if (zone === null) {
      errors.push(`${path}: timezone '${named}' is not an IANA zone`);
    }

    posts.push({ path, instant, zone });
  }

  return { posts, errors };
}

function weekdayErrors(posts: Post[]): string[] {
  return posts.flatMap(post => {
    if (post.zone === null || WEEKDAY_EXEMPT.has(post.path)) return [];

    const { weekday, text } = localStamp(post.instant, post.zone);
    if (SCHEDULED_WEEKDAYS.has(weekday)) return [];

    return [
      `${post.path}: publishes ${text}; use a Tuesday (tech) or a Sunday (personal)`,
    ];
  });
}

function collisionErrors(posts: Post[]): string[] {
  const sharing = Map.groupBy(posts, post => post.instant.getTime());

  return [...sharing]
    .sort(([a], [b]) => a - b)
    .filter(([, group]) => group.length > 1)
    .map(([instant, group]) => {
      const stamp = new Date(instant).toISOString().replace(".000Z", "Z");
      const paths = group.map(post => post.path).join(", ");
      return `${stamp}: shared by ${paths}; move one to the next open date on its weekday`;
    });
}

function main(): number {
  const { posts, errors } = readPosts();
  const all = [
    ...errors,
    ...weekdayErrors(posts),
    ...collisionErrors(posts),
  ].sort();

  for (const error of all) process.stderr.write(`${error}\n`);
  return all.length > 0 ? 1 : 0;
}

process.exitCode = main();
