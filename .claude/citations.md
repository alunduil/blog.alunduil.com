# Citations

Standards for grounding a post's claims in the author's actual reading.
Shared by `post-draft` and `review-draft`.

## Standards

- **Ground claims in reading the author actually engaged with.** Don't
  fabricate citations to works they haven't read. If the archive holds no
  canonical source for a claim, surface what's there honestly rather than
  inventing one.
- **Cite the original public source URL.** Resolve it from Reader's
  `source_url` field (below)—that's the link a reader can open.
- **Long URLs use reference-style links,** to stay within the 80-char
  source wrap.

## Finding the source (Readwise / Reader MCP)

The author's reading lives in Readwise and Reader; reach it via MCP:

- `mcp__claude_ai_Readwise__readwise_search_highlights`—vector-search
  the claim's topic. Add `full_text_queries` alongside the required
  `vector_search_term` for better recall.
- `mcp__claude_ai_Readwise__reader_search_documents`—filter
  `location_in=["archive"]`, vector-search the topic.
- `mcp__claude_ai_Readwise__reader_list_documents` with
  `response_fields=["url", "source_url", "title", "source"]`—resolve the
  public source URL to cite.
