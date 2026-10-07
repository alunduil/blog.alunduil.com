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

The card is a Mondrian composition with fixed rules. Lines are black.
Red, blue, and yellow appear only
as solid blocks, never as lines or text. Cream is the empty field, and its
text is black.

The accent was the card's blue in light mode and its red in dark mode.
Red on slate measures 2.91:1, below the 4.5:1 that the Web Content
Accessibility Guidelines (WCAG) 2.2 require at level AA for text. No
single card colour clears 4.5:1 for text on both backgrounds:

| Colour | On cream | On black |
| --- | --- | --- |
| Blue `#1E4FA1` | 6.82 | 2.53 |
| Red `#D5232A` | 4.47 | 3.87 |
| Yellow `#F1C232` | 1.47 | 11.79 |

The `--border` token also outlines the search input, which needs 3:1 as a
user-interface component under WCAG 2.2 success criterion 1.4.11.

## Decision

Take every site colour from the card, follow its line rule, and meet
WCAG 2.2 AA in both themes. The tokens in `src/styles/global.css`:

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | Cream | Black | The card's field, inverted in dark mode |
| `--foreground` | Black | Cream | The card's text, inverted in dark mode |
| `--accent` | Blue | Yellow | The one card colour that reads as text on that background |
| `--border` | Black | Cream | The card's lines, inverted in dark mode |
| `--muted` | Derived | Derived | Background mixed 8% toward foreground, for raised surfaces |

Link text in blue or yellow breaks the card's rules. Following them would mean
redesigning links. Text selection uses the full-strength accent,
because cream on 75% blue measures 3.94:1.

The card has no dark version, so dark mode inverts it: cream lines and
text on a black field. Cream is the only card colour other than red
that clears 3:1 on black, and red lines break the card's rule.

Browser chrome `theme-color` uses each theme's `--background`. The
manifest holds one `theme_color` and one `background_color`, so both
take the light background.

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
- Header, footer, table, and image borders are full-contrast lines, as
  strong as the card's.
- Red appears only on the card. Bringing it to the site means adding
  solid colour blocks. As decoration, blocks need no contrast check.
- A new token or colour starts from the card's five colours and needs
  its own contrast check in both themes. Yellow can't carry text in
  light mode, and blue can't in dark mode.
- Hand-copied values outside `global.css` repeat the palette: the card
  template, the `theme-color` tags, the manifest, and figures with a
  baked-in background such as the contributions chart. A palette change
  updates each copy.
- Code blocks keep their Shiki themes' colours.
- Upstream AstroPaper updates to `global.css` conflict on these tokens.
  Resolve conflicts in favour of this record.
