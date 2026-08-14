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
import { existsSync } from "node:fs";
import path from "node:path";

/** The `-dark` sibling of `/assets/foo.svg` is `/assets/foo-dark.svg`. */
const DARK_SUFFIX = "-dark";

/** The other half of the contract with `src/styles/typography.css`. */
const LIGHT_CLASS = "theme-image-light";
const DARK_CLASS = "theme-image-dark";

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

/** An `img` whose `src` is known to be a string, so neither needs re-checking. */
type ImageNode = HastNode & { properties: HastProperties & { src: string } };

function asImageNode(node: HastNode): ImageNode | undefined {
  const src = node.properties?.src;
  if (node.tagName !== "img" || typeof src !== "string") return undefined;
  return node as ImageNode;
}

/** Root-relative, so `public/`; a protocol-relative `//host` is remote. */
function isPublicAsset(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/**
 * An image under `src/assets/` never reaches here: Astro's image service
 * rewrites its `src` to a hashed build path with no predictable sibling.
 */
function darkVariantPath(src: string): string | undefined {
  const extension = path.extname(src);
  if (!extension) return undefined;

  const stem = src.slice(0, -extension.length);
  if (stem.endsWith(DARK_SUFFIX)) return undefined;

  return `${stem}${DARK_SUFFIX}${extension}`;
}

/**
 * Astro bundles `astro.config.ts` and its imports into a single module at the
 * project root, so `import.meta.url` points there rather than at this file.
 * The working directory is the reliable anchor for the lookup.
 */
function existsInPublic(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

/** One half of the pair: the original image, reclassed and repointed. */
function variantImage(
  image: ImageNode,
  className: string,
  src: string
): HastNode {
  const { properties } = image;
  const classNames = Array.isArray(properties.className)
    ? properties.className
    : [];

  return {
    ...image,
    properties: { ...properties, className: [...classNames, className], src },
  };
}

function themeImagePair(node: HastNode): HastNode[] | undefined {
  const image = asImageNode(node);
  if (!image) return undefined;

  const { src } = image.properties;
  if (!isPublicAsset(src)) return undefined;

  const darkSrc = darkVariantPath(src);
  if (!darkSrc || !existsInPublic(darkSrc)) return undefined;

  return [
    variantImage(image, LIGHT_CLASS, src),
    variantImage(image, DARK_CLASS, darkSrc),
  ];
}

/** Reverse order so splicing a pair in doesn't shift the indices still to visit. */
function pairImagesIn(node: HastNode): void {
  const children = node.children;
  if (!children) return;

  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    if (child.type !== "element") continue;

    pairImagesIn(child);

    const pair = themeImagePair(child);
    if (pair) children.splice(index, 1, ...pair);
  }
}

export default function rehypeThemeImages() {
  return pairImagesIn;
}
