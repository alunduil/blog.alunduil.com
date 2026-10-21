/**
 * Turn `mermaid` fences into `<pre class="mermaid">` for
 * `mermaidDiagrams.ts` to render in the browser.
 *
 * The source is also kept in `data-diagram`, so scripts that append to the
 * `pre`, such as the code copy button, can't corrupt it. The text content
 * is the no-JavaScript fallback.
 */
type MdastNode = {
  type: string;
  lang?: string | null;
  value?: string;
  data?: object;
  children?: MdastNode[];
};

function transform(node: MdastNode): void {
  for (const child of node.children ?? []) {
    if (child.type === "code" && child.lang === "mermaid") {
      const source = child.value ?? "";
      // remark-rehype builds an unknown node's element from `data`, so the
      // HTML serializer escapes the source. A `code` node's data would land
      // on its inner `code` element, inside a second `pre`.
      child.type = "mermaid";
      child.data = {
        hName: "pre",
        hProperties: { className: ["mermaid"], dataDiagram: source },
        hChildren: [{ type: "text", value: source }],
      };
    } else {
      transform(child);
    }
  }
}

export default function remarkMermaid() {
  return transform;
}
