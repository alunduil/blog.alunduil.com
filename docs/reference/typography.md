# Typography

The faces the site renders and the weight scale. Palette and code
highlighting are out of scope.

## Faces

| Face | Renders | Named by |
| --- | --- | --- |
| IBM Plex Mono | body copy, code blocks | `bodyFont` in `blog.config.ts` |
| IBM Plex Sans | header title, OG cards | `BRAND_FONT` in `src/utils/loadBrandFonts.ts` |

The OG cards load `BRAND_FONT` from its `@fontsource` package. Changing
`BRAND_FONT` means installing the matching package.

## Weights

| Weight | Utility | Use |
| --- | --- | --- |
| 400 | default | running text |
| 500 | `font-medium` | labels and listing titles |
| 600 | `font-semibold` | headings |
| 700 | `font-bold` | titles |

Each face loads only the weights its configuration lists, in
`blog.config.ts` and, for the OG cards, `loadBrandFonts.ts`. A browser
synthesises any other weight, so add a weight there before using it.
