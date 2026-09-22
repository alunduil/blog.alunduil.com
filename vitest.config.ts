/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig resolves the astro: virtual modules and the @/ alias, so
// tests can vi.mock them like any other import.
export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
