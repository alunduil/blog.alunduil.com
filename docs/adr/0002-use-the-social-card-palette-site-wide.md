# 2. Use the social card palette site-wide

## Status

Accepted

## Context

The blog's branding is the five-colour palette of its OG social card in
`src/utils/og-templates/mondrian.js`: cream `#F4EFE6`, black `#0A0A0A`,
red `#D5232A`, blue `#1E4FA1`, and yellow `#F1C232`. The browser chrome
`theme-color` in `src/layouts/Layout.astro` and the colours in
`public/site.webmanifest` already used the card's cream and black. The
page itself kept AstroPaper's near-white `#fdfdfd` and slate `#212737`,
so the mobile address bar showed a colour the page never did.

The card is a Mondrian composition with fixed rules. Lines are black:
every division is an 8px black gap. Red, blue, and yellow appear only
as solid blocks, never as lines or text. Cream is the empty field, and its
text is black.

The accent was the card's blue in light mode and its red in dark mode.
Red on slate measures 2.91:1, below the 4.5:1 that the Web Content
Accessibility Guidelines (WCAG) 2.2 require at level AA for text. The
card's colours behave differently on the two backgrounds:

| Colour | On cream | On black |
| --- | --- | --- |
| Blue `#1E4FA1` | 6.82 | 2.53 |
| Red `#D5232A` | 4.47 | 3.87 |
| Yellow `#F1C232` | 1.47 | 11.79 |

No single card colour clears 4.5:1 for text on both backgrounds. The
`--border` token also outlines the search input, which needs 3:1 as a
user-interface component under WCAG 2.2 success criterion 1.4.11.

## Decision

Take every site colour from the card, follow its line rule, and meet
WCAG 2.2 AA in both themes. The tokens in `src/styles/global.css`:

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#f4efe6` cream | `#0a0a0a` black | Card background per theme |
| `--foreground` | `#0a0a0a` black | `#f4efe6` cream | The card's text colour, inverted on black |
| `--accent` | `#1e4fa1` blue | `#f1c232` yellow | Whichever card colour reads as text on that background |
| `--border` | `#0a0a0a` black | `#f4efe6` cream | The card's line colour, inverted on black |
| `--muted` | `#e1ddd4` | `#1d1c1c` | Background mixed 8% toward foreground, for raised surfaces |

The accent changes hue between themes because contrast demands it:
blue is the only card colour that reads as text on cream, and yellow
the only one on black. Links carry colour as text, which the card never
does. Holding links to the card's rules would mean redesigning them.

Borders follow the card's black lines. The card has no dark version, so
dark mode inverts the grid: cream lines on a black field. Cream is also
the only card colour other than red that clears 3:1 on black, and red
lines break the card's rule. Red therefore has no role on the site. Its
place in the card's rules is a solid block, which needs no contrast
check as decoration.

Browser chrome `theme-color` uses each theme's `--background`. The
manifest holds one `theme_color` and one `background_color`, so both
take the light background.

Text selection uses the full-strength accent: cream on 75% blue measures
3.94:1.

Measured contrast, using the WCAG 2.2 relative-luminance formula:

| Pair | Light | Dark |
| --- | --- | --- |
| Foreground on background | 17.29 | 17.29 |
| Foreground on muted | 14.61 | 14.85 |
| Foreground at 70% opacity on background | 7.15 | 8.57 |
| Accent on background | 6.82 | 11.79 |
| Accent at 85% opacity on background | 4.91 | 8.59 |
| Accent at 75% opacity (focus outline) on background | 3.94 | 6.86 |
| Background on accent (selection) | 6.82 | 11.79 |
| Border on background | 17.29 | 17.29 |

## Consequences

- The page, browser chrome, manifest, and OG card agree, so a shared
  link previews in the site's own colours.
- Every text pair clears 4.5:1 and every non-text pair clears 3:1 in
  both themes.
- Borders read as full-contrast rules rather than AstroPaper's faint
  grey. Header, footer, table, and image borders are as strong as the
  card's lines.
- Red appears only on the card. Bringing it to the site means adding
  solid colour blocks, not recolouring an existing token.
- A new token or colour starts from the card's five colours and needs
  its own contrast check in both themes. Yellow can't carry text in
  light mode, and blue can't in dark mode.
- Figures that bake a background into the image follow these tokens.
  `scripts/contributions-heatmap.py` draws its chart on each
  theme's background and muted colours.
- Syntax-highlighted code blocks keep their Shiki themes' own
  backgrounds and colours. The palette doesn't reach inside them.
- Upstream AstroPaper theme updates that touch `global.css` conflict on
  these values. Keep the values recorded here.
