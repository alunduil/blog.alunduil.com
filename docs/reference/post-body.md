# Post body markup

The markdown machinery available inside a post body, beyond plain
CommonMark. For frontmatter, scheduling, and file locations, see
[post frontmatter and scheduling](post-frontmatter.md).

## Headings

`PostDetails.astro` renders the frontmatter `title` as the page `h1`.
Body headings start at `h2`.

## Table of contents

A literal `## Table of contents` heading in the body becomes a
collapsible table of contents. `remark-toc` fills the section from the
headings that follow it, and `remark-collapse` wraps it in a `details`
element. `astro.config.ts` wires both, and `remark-collapse` matches the
heading text exactly.

Posts without that heading render no table of contents.

## Images

Three storage locations, differing in optimisation and path form.

| Location | Optimised | Path in the body |
| --- | --- | --- |
| `src/assets/` | yes | `@/assets/…` or a relative path |
| `public/` | no | absolute, `/…` |
| Remote host | no | absolute URL |

Images under `src/assets/` pass through Astro's image service. Reference
them with the `@/assets/` alias or with a path relative to the post file,
which varies by folder depth—two `../` from `src/data/blog/<slug>.md`,
three from `src/data/blog/reviews/<slug>.md`:

```md
![alt text](@/assets/images/example.png)
![alt text](../../assets/images/example.png)
```

Optimised images resolve through markdown image syntax only. An `img`
tag pointing at `@/assets/` or at a relative path doesn't resolve.

Astro serves files under `public/` untouched at an absolute path. They
work in both markdown image syntax and an `img` tag:

```md
![alt text](/assets/example.svg)
```

Astro's image settings are `layout: "constrained"` and
`responsiveStyles: true`, so optimised images carry responsive styles and
scale down within their container.

`ogImage` is frontmatter rather than body markup; see
[post frontmatter and scheduling](post-frontmatter.md).

## Code blocks

Shiki highlights fenced code blocks. It carries dual themes, `min-light`
and `night-owl`, matching the site's light and dark mode. Long lines
scroll rather than wrap.

A `file` attribute on the fence info string renders a filename label on
the block:

````md
```ts file="src/content.config.ts"
export const collections = { blog };
```
````

Comments in the code drive three enabled `@shikijs/transformers`
notation transformers:

| Transformer | Notation |
| --- | --- |
| `transformerNotationHighlight` | `[!code highlight]` |
| `transformerNotationWordHighlight` | `[!code word:…]` |
| `transformerNotationDiff` | `[!code ++]`, `[!code --]` |

Rendering strips the notation comment from the output. For the full
syntax, including ranges, see the
[@shikijs/transformers documentation](https://shiki.style/packages/transformers).
