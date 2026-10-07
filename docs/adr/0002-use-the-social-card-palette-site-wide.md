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

Take every site colour from the card, and meet WCAG 2.2 AA in both
themes. The tokens in `src/styles/global.css`:

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#f4efe6` cream | `#0a0a0a` black | Card background per theme |
| `--foreground` | `#282728` | `#eaedf3` | Body text |
| `--accent` | `#1e4fa1` blue | `#f1c232` yellow | Whichever card colour reads as text on that background |
| `--border` | `#d5232a` red | `#d5232a` red | The card's red, which clears 3:1 on both backgrounds |
| `--muted` | `#e4dfd7` | `#1c1c1d` | Background mixed 8% toward foreground, for raised surfaces |

The accent changes hue between themes because contrast demands it:
blue is the only card colour that reads as text on cream, and yellow
the only one on black. Red moves from the dark accent to the border in
both themes, so all three card colours appear on the site.

Browser chrome `theme-color` uses each theme's `--background`. The
manifest holds one `theme_color` and one `background_color`, so both
take the light background.

Text selection uses the full-strength accent: cream on 75% blue measures
3.94:1.

Measured contrast, using the WCAG 2.2 relative-luminance formula:

| Pair | Light | Dark |
| --- | --- | --- |
| Foreground on background | 12.99 | 16.88 |
| Foreground on muted | 11.22 | 14.52 |
| Foreground at 70% opacity on background | 5.22 | 8.41 |
| Accent on background | 6.82 | 11.79 |
| Accent at 85% opacity on background | 4.91 | 8.59 |
| Accent at 75% opacity (focus outline) on background | 3.94 | 6.86 |
| Background on accent (selection) | 6.82 | 11.79 |
| Border on background | 4.47 | 3.87 |

## Consequences

- The page, browser chrome, manifest, and OG card agree, so a shared
  link previews in the site's own colours.
- Every text pair clears 4.5:1 and every non-text pair clears 3:1 in
  both themes.
- Red borders are louder than AstroPaper's faint grey. Header, footer,
  table, and image borders now carry colour in both themes.
- A new token or colour starts from the card's five colours and needs
  its own contrast check in both themes. Yellow can't carry text in
  light mode, and blue can't in dark mode.
- Syntax-highlighted code blocks keep their Shiki themes' own
  backgrounds and colours. The palette doesn't reach inside them.
- Upstream AstroPaper theme updates that touch `global.css` conflict on
  these values. Keep the values recorded here.
