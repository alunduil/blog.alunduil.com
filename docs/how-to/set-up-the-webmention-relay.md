# Set up the webmention relay

The relay in `workers/webmention-relay/` receives webmention.io's
callback on each new or deleted mention. It answers by firing a
`webmention` `repository_dispatch` at this repository. CI deploys the
code, and you set four pieces outside the repository by hand:

- the Cloudflare token CI deploys with
- the GitHub token the Worker dispatches with
- the Worker's two secrets
- webmention.io's callback

This guide assumes owner access to the alunduil Cloudflare account, this
repository, and the webmention.io account for `blog.alunduil.com`.
Whether a dispatch rebuilds the site is the deploy workflow's concern,
not covered here.

## Create the Cloudflare deploy token

Wrangler deploys the Worker and attaches `webmention.alunduil.com` with
one token. Every Workers permission is account-wide, so this token can
overwrite any Worker on the account. If it leaks, revoke it first and
replace it second.

1. In the Cloudflare dashboard, create an API token from the **Edit
   Cloudflare Workers** template.
2. Scope **Account Resources** to the alunduil account and **Zone
   Resources** to `alunduil.com`.
3. Save it as the `CLOUDFLARE_API_TOKEN` secret on this repository.

## Deploy the relay

1. Run the **Webmention relay** workflow from the Actions tab.
2. Confirm `https://webmention.alunduil.com/` answers a `GET` with `405`.

Until you set its secrets, the Worker answers every `POST` with `503`.

## Create the GitHub dispatch token

1. Create a fine-grained personal access token with access to
   `alunduil/blog.alunduil.com` only.
2. Grant the **Contents** repository permission at **Read and write**,
   which the dispatch endpoint requires.
3. Note its expiry. Once it expires, the relay answers `502` and the
   display falls back to scheduled rebuilds. Repeat this section and the
   next to replace it.

## Set the relay's secrets

Generate a long random value for the shared secret, then from
`workers/webmention-relay/`:

```bash
pnpm exec wrangler secret put WEBMENTION_SECRET
pnpm exec wrangler secret put GITHUB_DISPATCH_TOKEN
```

Each command prompts for its value, so neither lands in shell history.
Authenticate Wrangler with `wrangler login` or by exporting a
`CLOUDFLARE_API_TOKEN` first.

## Point webmention.io at the relay

1. In webmention.io's settings for `blog.alunduil.com`, open the web
   callback settings.
2. Set the URL to `https://webmention.alunduil.com/`.
3. Set the secret to the `WEBMENTION_SECRET` value.

## Verify the relay

The relay rejects a wrong secret without dispatching:

```bash
curl -i -X POST https://webmention.alunduil.com/ \
  -H 'content-type: application/json' -d '{"secret":"wrong"}'
```

Expect `403`. Send a test mention from webmention.io, or a `POST` with
the real secret. Expect `204`, plus a new `repository_dispatch` event in
the repository's activity.
