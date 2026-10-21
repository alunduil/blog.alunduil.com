/**
 * Render `<pre class="mermaid">` blocks from `remarkMermaid.ts` in the
 * site palette, and re-render them when the theme toggles.
 *
 * Mermaid's `base` theme is the only one that takes custom colours. It
 * derives shades from them, so they must be literal values, not CSS
 * variables. Reading them from `theme.css` at render time keeps that file
 * the one source of the site's colours.
 */
import type { MermaidConfig } from "mermaid";

function token(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function config(): MermaidConfig {
  const background = token("--background");
  const foreground = token("--foreground");
  // Sequence diagrams set their text weights inline, past the stylesheet.
  const weight = token("--diagram-weight");

  return {
    startOnLoad: false,
    // The default "neo" look adds shadows and gradient borders; the card
    // is flat.
    look: "classic",
    // Shrinking a wide diagram to fit the column shrinks its labels too.
    flowchart: { useMaxWidth: false },
    sequence: {
      useMaxWidth: false,
      actorFontWeight: weight,
      messageFontWeight: weight,
      noteFontWeight: weight,
    },
    theme: "base",
    themeVariables: {
      background,
      fontFamily: getComputedStyle(document.body).fontFamily,
      primaryColor: token("--muted"),
      primaryTextColor: foreground,
      primaryBorderColor: foreground,
      secondaryColor: token("--muted"),
      tertiaryColor: background,
      lineColor: foreground,
      textColor: foreground,
      noteBkgColor: token("--yellow"),
      noteTextColor: token("--black"),
      noteBorderColor: foreground,
    },
  };
}

async function render(): Promise<void> {
  const diagrams = document.querySelectorAll<HTMLElement>(
    "pre.mermaid[data-diagram]"
  );
  if (diagrams.length === 0) return;

  const { default: mermaid } = await import("mermaid");
  mermaid.initialize(config());

  for (const [index, diagram] of diagrams.entries()) {
    const source = diagram.dataset.diagram ?? "";
    try {
      const { svg } = await mermaid.render(`mermaid-${index}`, source);
      diagram.innerHTML = svg;
    } catch {
      diagram.textContent = source;
    }
  }
}

// The theme script sets `data-theme` during page load, so a theme render
// can overlap the load render. Mermaid renders through shared element ids,
// so renders queue.
let queue = Promise.resolve();
function schedule(): void {
  queue = queue.then(render, render);
}

document.addEventListener("astro:page-load", schedule);

new MutationObserver(schedule).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});
