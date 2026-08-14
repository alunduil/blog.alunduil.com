/**
 * Render a post image that has a `-dark` sibling as a light and dark pair.
 *
 * An `<img>` loads the SVG as a separate document, so the page's `data-theme`
 * never reaches it and it cannot recolour itself. Emitting both variants moves
 * the choice to CSS. See `docs/reference/post-body.md` for the convention.
 */
import { existsSync } from "node:fs";
import path from "node:path";

/** The `-dark` sibling of `/assets/foo.svg` is `/assets/foo-dark.svg`. */
const DARK_SUFFIX = "-dark";

/** Matched by the swap rules in `src/styles/typography.css`. */
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

function darkVariantPath(src: string): string | undefined {
  const extension = path.extname(src);
  if (!extension) return undefined;

  const stem = src.slice(0, -extension.length);
  if (stem.endsWith(DARK_SUFFIX)) return undefined;

  return `${stem}${DARK_SUFFIX}${extension}`;
}

/**
 * Astro bundles this module into `astro.config.ts` at the project root, so
 * `import.meta.url` points there, not here. The working directory is the
 * reliable anchor.
 */
function existsInPublic(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

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
