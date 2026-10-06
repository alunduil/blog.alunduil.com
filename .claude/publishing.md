# Final state before leaving draft

Shared by `post-draft` and `review-draft`. Each skill adds its
type-specific items.

- Title, description, and slug match the body.
- `pubDatetime` set to a future 08:00 local on the post type's cadence day
  (`docs/reference/post-frontmatter.md`).
- `pre-commit run --files <path>` passes.
- `pnpm build` clean.
- Body links point at public source URLs (`.claude/citations.md`).
