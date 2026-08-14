import { readFile } from "node:fs/promises";

import { BRAND_FONT } from "@/config";

type BrandFont = {
  name: string;
  data: Buffer;
  weight: number;
  style: string;
};

// Fontsource package and file names are the family lowercased and hyphenated,
// so a change of BRAND_FONT points at the package that has to be installed
// alongside it.
const FAMILY = BRAND_FONT.toLowerCase().replaceAll(" ", "-");

// Satori reads WOFF but not WOFF2, and the latin subset covers everything the
// OG templates can render.
const FACES = [
  { weight: 400, style: "normal" },
  { weight: 700, style: "bold" },
];

let fonts: Promise<BrandFont[]> | undefined;

async function loadBrandFonts(): Promise<BrandFont[]> {
  fonts ??= Promise.all(
    FACES.map(async ({ weight, style }) => ({
      name: BRAND_FONT,
      weight,
      style,
      data: await readFile(
        new URL(
          import.meta.resolve(
            `@fontsource/${FAMILY}/files/${FAMILY}-latin-${weight}-normal.woff`
          )
        )
      ),
    }))
  );

  return fonts;
}

export default loadBrandFonts;
