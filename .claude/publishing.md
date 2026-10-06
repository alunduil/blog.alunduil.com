# Final state before leaving draft

The state a post's PR reaches before it leaves draft. Shared by
`post-draft` and `review-draft`; each adds only its type-specific items.

- Title, description, and slug match the body.
- `pubDatetime` set to a future 08:00 local on the post type's cadence day
  (`docs/reference/post-frontmatter.md`).
- Vale and markdownlint pass via `pre-commit run --files <path>`.
- `pnpm build` clean.
- Body links point at public source URLs (`.claude/citations.md`).
