import { readFile } from "node:fs/promises";

import type { Font, FontWeight } from "satori";

import { BRAND_FONT } from "@/config";

// Fontsource package and file names are the family lowercased and hyphenated,
// so a change of BRAND_FONT points at the package that has to be installed
// alongside it.
const FAMILY = BRAND_FONT.toLowerCase().replaceAll(" ", "-");

// Satori reads WOFF but not WOFF2, and the latin subset covers everything the
// OG templates can render.
const WEIGHTS: FontWeight[] = [400, 700];

function faceFile(weight: FontWeight): URL {
  return new URL(
    import.meta.resolve(
      `@fontsource/${FAMILY}/files/${FAMILY}-latin-${weight}-normal.woff`
    )
  );
}

async function readFace(weight: FontWeight): Promise<Font> {
  return { name: BRAND_FONT, weight, data: await readFile(faceFile(weight)) };
}

let cached: Promise<Font[]> | undefined;

function loadBrandFonts(): Promise<Font[]> {
  return (cached ??= Promise.all(WEIGHTS.map(weight => readFace(weight))));
}

export default loadBrandFonts;
