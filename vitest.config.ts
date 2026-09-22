/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Astro's Vite config resolves the astro: virtual modules; under a plain
// Vitest config, importing them fails.
export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
