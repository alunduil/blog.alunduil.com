import type { CollectionEntry } from "astro:content";
import { CLOUDFLARE_ANALYTICS_API_TOKEN } from "astro:env/server";
import { SITE } from "@/config";
import { getPath } from "./getPath";
import postFilter from "./postFilter";

const ANALYTICS_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";

// Rolling window for "popular": reflects what's resonating now rather than
// ossifying around a handful of legacy hits.
const WINDOW_DAYS = 90;

// Distinct paths pulled from the API before joining against the collection.
// Well above the post count so the join isn't starved by non-post paths
// (the homepage, feeds, dead pre-migration URLs) ranking above real posts.
const PATH_LIMIT = 100;

const POPULAR_POST_COUNT = 5;

// Upstream AstroPaper content that ships in the collection (see the "AstroPaper
// upstream" list in CLAUDE.md). The example drafts and most tutorial posts
// carry a foreign `author`, but the release notes under `_releases/` set none
// and so inherit SITE.author — the author filter alone would let them rank.
// `_hakyll`/`_nikola` are *restored author* posts, so this excludes by exact
// upstream directory rather than the leading underscore.
const UPSTREAM_DIRS = ["_releases", "examples"];

function isUpstream(filePath: string | undefined): boolean {
  return (filePath?.split("/") ?? []).some(seg => UPSTREAM_DIRS.includes(seg));
}

type RumRow = { count: number; dimensions: { requestPath: string } };

// Cloudflare's RUM counts are adaptively sampled (they arrive rounded to
// tens), so the value is only meaningful as a ranking key, never a display
// figure. Trailing-slash variants of the same path are summed.
function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

async function fetchPathCounts(): Promise<Map<string, number>> {
  const host = new URL(SITE.website).host;
  const since = new Date(
    Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // Values interpolated below are our own constants (config, computed
  // window) — no external input, so no injection surface.
  const query = `query {
    viewer {
      accounts(filter: { accountTag: ${JSON.stringify(SITE.cloudflareAnalyticsAccountTag)} }) {
        rumPageloadEventsAdaptiveGroups(
          limit: ${PATH_LIMIT}
          filter: { datetime_geq: ${JSON.stringify(since)}, requestHost: ${JSON.stringify(host)} }
          orderBy: [count_DESC]
        ) {
          count
          dimensions { requestPath }
        }
      }
    }
  }`;

  const res = await fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error(`Analytics fetch ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: {
      viewer?: { accounts?: { rumPageloadEventsAdaptiveGroups: RumRow[] }[] };
    };
    errors?: unknown;
  };
  if (json.errors) {
    throw new Error(`Analytics query error: ${JSON.stringify(json.errors)}`);
  }

  const rows =
    json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];

  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = normalizePath(row.dimensions.requestPath);
    counts.set(key, (counts.get(key) ?? 0) + row.count);
  }
  return counts;
}

/**
 * Rank the author's own posts by page views over a rolling window, sourced
 * from Cloudflare's RUM analytics at build time.
 *
 * Eligibility is the author's own writing only: posts authored by
 * {@link SITE.author} (foreign-authored guest tutorials drop out) that don't
 * live under an upstream content directory (the `_releases/` notes set no
 * author and would otherwise inherit SITE.author). The join against resolved
 * post paths also drops dead pre-migration `.html` URLs and non-post paths
 * that appear in the analytics data.
 *
 * Returns an empty list — so the caller hides the section — whenever the API
 * token is absent (local dev, fork PRs, before the secret is provisioned) or
 * the fetch fails. A decorative widget must never break a deploy.
 */
export async function getPopularPosts(
  posts: CollectionEntry<"blog">[],
  limit = POPULAR_POST_COUNT
): Promise<CollectionEntry<"blog">[]> {
  if (!CLOUDFLARE_ANALYTICS_API_TOKEN) return [];

  let counts: Map<string, number>;
  try {
    counts = await fetchPathCounts();
  } catch {
    return [];
  }

  return posts
    .filter(postFilter)
    .filter(post => post.data.author === SITE.author)
    .filter(post => !isUpstream(post.filePath))
    .map(post => ({
      post,
      count: counts.get(normalizePath(getPath(post.id, post.filePath))) ?? 0,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ post }) => post);
}
