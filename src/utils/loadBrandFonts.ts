import { readFile } from "node:fs/promises";

import type { Font, FontWeight } from "satori";

import { BRAND_FONT } from "@/config";

// Fontsource names its packages and files after the family, lowercased and
// hyphenated.
const FAMILY = BRAND_FONT.toLowerCase().replaceAll(" ", "-");

const WEIGHTS: FontWeight[] = [400, 700];

// Satori reads WOFF but not the WOFF2 alongside it. The latin subset stops at
// Latin-1 and general punctuation; anything wider needs latin-ext loaded too.
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
