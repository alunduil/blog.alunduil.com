import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Render a post image that has a `-dark` sibling as a light and dark pair.
 *
 * An SVG loaded through `<img>` is an isolated document: it can read the OS
 * `prefers-color-scheme` but never the `data-theme` attribute AstroPaper's
 * toggle sets, so it cannot swap itself. Emitting both variants lets CSS in
 * `src/styles/typography.css` pick the one matching the theme.
 *
 * This runs on the page pipeline only. `renderPostBody` deliberately omits it:
 * a feed reader can't see `data-theme` either, so the feed keeps the single
 * light image the body already describes.
 */

/** The `-dark` sibling of `/assets/foo.svg` is `/assets/foo-dark.svg`. */
const DARK_SUFFIX = "-dark";

type HastProperties = Record<string, unknown> & {
  src?: unknown;
  className?: unknown;
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: HastProperties;
  children?: HastNode[];
};

/**
 * Only `public/` images resolve here. An image under `src/assets/` reaches the
 * page through Astro's image service, which rewrites its `src` to a hashed
 * build path this plugin has no way to pair.
 */
function darkVariantPath(src: string): string | undefined {
  const extension = path.extname(src);
  if (!extension) return undefined;

  const stem = src.slice(0, -extension.length);
  if (stem.endsWith(DARK_SUFFIX)) return undefined;

  return `${stem}${DARK_SUFFIX}${extension}`;
}

/** Root-relative, so `public/`; a protocol-relative `//host` is remote. */
function isPublicAsset(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

function withClass(
  properties: HastProperties,
  className: string
): HastProperties {
  const existing = Array.isArray(properties.className)
    ? properties.className
    : [];
  return { ...properties, className: [...existing, className] };
}

/**
 * Astro bundles `astro.config.ts` and its imports into a single module at the
 * project root, so `import.meta.url` points there rather than at this file.
 * The working directory is the reliable anchor for the `public/` lookup.
 */
function hasDarkVariant(darkSrc: string): boolean {
  return existsSync(path.join(process.cwd(), "public", darkSrc));
}

function themeImagePair(node: HastNode): HastNode[] | undefined {
  if (node.tagName !== "img") return undefined;

  const properties = node.properties;
  const src = properties?.src;
  if (typeof src !== "string" || !isPublicAsset(src)) return undefined;

  const darkSrc = darkVariantPath(src);
  if (!darkSrc || !hasDarkVariant(darkSrc)) return undefined;

  return [
    { ...node, properties: withClass(properties!, "theme-image-light") },
    {
      ...node,
      properties: {
        ...withClass(properties!, "theme-image-dark"),
        src: darkSrc,
      },
    },
  ];
}

/** Reverse order so splicing a pair in doesn't shift the indices still to visit. */
function transform(node: HastNode): void {
  const children = node.children;
  if (!children) return;

  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    if (child.type !== "element") continue;

    transform(child);

    const pair = themeImagePair(child);
    if (pair) children.splice(index, 1, ...pair);
  }
}

export default function rehypeThemeImages() {
  return (tree: HastNode) => transform(tree);
}
