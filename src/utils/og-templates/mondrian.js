import loadBrandFonts from "../loadBrandFonts";

export const COLORS = {
  cream: "#F4EFE6",
  black: "#0A0A0A",
  red: "#D5232A",
  blue: "#1E4FA1",
  yellow: "#F1C232",
};

export const STROKE = 8;

export const canvas = async () => ({
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: await loadBrandFonts(),
});

export const block = (background, extra = {}) => ({
  type: "div",
  props: { style: { background, display: "flex", ...extra } },
});
