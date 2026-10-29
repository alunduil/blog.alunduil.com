import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const lightTheme =
  readFileSync(new URL("./theme.css", import.meta.url), "utf8").match(
    /\[data-theme="light"\]\s*\{([^}]*)\}/
  )?.[1] ?? "";

const token = (name: string) => {
  const value = lightTheme.match(
    new RegExp(`--${name}:\\s*(#[0-9a-f]{6});`, "i")
  )?.[1];
  if (!value) throw new Error(`--${name} is not a hex colour`);
  return value;
};

// WCAG 2.2 relative luminance and contrast ratio.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("light theme --muted-foreground", () => {
  it.each(["background", "muted"])("meets WCAG AA on --%s", fill => {
    expect(
      contrast(token("muted-foreground"), token(fill))
    ).toBeGreaterThanOrEqual(4.5);
  });
});
