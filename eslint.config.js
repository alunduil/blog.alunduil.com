import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  { rules: { "no-console": "error" } },
  // CI scripts report progress to the workflow log; console is the interface.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
  { ignores: ["dist/**", ".astro", "public/pagefind/**"] },
];
