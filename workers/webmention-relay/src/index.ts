/**
 * Relays webmention.io callbacks into a `repository_dispatch` on the blog.
 *
 * webmention.io POSTs JSON with the shared secret in the body and sends no
 * auth headers, so it cannot call GitHub's dispatch API itself.
 */

const DISPATCH_URL =
  "https://api.github.com/repos/alunduil/blog.alunduil.com/dispatches";
const EVENT_TYPE = "webmention";

export interface Env {
  WEBMENTION_SECRET?: string;
  GITHUB_DISPATCH_TOKEN?: string;
}

// Digesting both sides first gives timingSafeEqual the equal-length buffers
// it requires without an early length check leaking the stored secret's
// length.
async function secretMatches(
  supplied: string,
  expected: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(supplied)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);

  return crypto.subtle.timingSafeEqual(a, b);
}

export default {
  // A new mention and a deleted one both change the display, so the relay
  // doesn't distinguish them.
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("method not allowed\n", { status: 405 });
    }

    // Wrangler deploys the script before its secrets exist on first deploy.
    if (!env.WEBMENTION_SECRET || !env.GITHUB_DISPATCH_TOKEN) {
      return new Response("relay not configured\n", { status: 503 });
    }

    let payload: { secret?: unknown } | null;
    try {
      payload = await request.json();
    } catch {
      return new Response("expected a JSON body\n", { status: 400 });
    }

    if (
      typeof payload?.secret !== "string" ||
      !(await secretMatches(payload.secret, env.WEBMENTION_SECRET))
    ) {
      return new Response("forbidden\n", { status: 403 });
    }

    const dispatch = await fetch(DISPATCH_URL, {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
        "content-type": "application/json",
        "user-agent": "webmention-relay",
      },
      body: JSON.stringify({ event_type: EVENT_TYPE }),
    });

    if (!dispatch.ok) {
      return new Response(`dispatch failed: ${dispatch.status}\n`, {
        status: 502,
      });
    }

    return new Response(null, { status: 204 });
  },
} satisfies ExportedHandler<Env>;
