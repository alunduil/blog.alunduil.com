# Citations

How to ground a post's claims in the author's actual reading. Shared by
`post-draft` and `review-draft`; agent-facing (MCP tool calls a human
never makes).

Ground claims where applicable — don't fabricate citations to works the
author hasn't engaged with. If the archive lacks a canonical source for a
claim, surface what's actually there honestly rather than inventing one.

## Find the reading

- `mcp__claude_ai_Readwise__readwise_search_highlights` — vector-search
  the claim's topic. Add `full_text_queries` alongside the required
  `vector_search_term` for better recall.
- `mcp__claude_ai_Readwise__reader_search_documents` — filter
  `location_in=["archive"]`, vector-search the topic.

## Get a public URL

Resolve the original source URL via
`mcp__claude_ai_Readwise__reader_list_documents` with
`response_fields=["url", "source_url", "title", "source"]`.

**Never link the private `https://read.readwise.io/...` URLs** — readers
can't reach them. Cite the original source URL only.

## Link style

For long URLs, use reference-style links to stay within the 80-char
source wrap.
