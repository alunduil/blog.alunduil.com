import { timingSafeEqual } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import relay, { type Env } from "./index.ts";

const SECRET = "shared-secret";
const TOKEN = "github-token";
const env: Env = { WEBMENTION_SECRET: SECRET, GITHUB_DISPATCH_TOKEN: TOKEN };

function callback(body: unknown): Request {
  return new Request("https://webmention.alunduil.com/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function call(request: Request, bindings: Env = env): Promise<Response> {
  return relay.fetch(request as never, bindings) as Promise<Response>;
}

describe("webmention relay", () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Workers extends SubtleCrypto with timingSafeEqual; Node puts it on
    // node:crypto with the same equal-length contract.
    vi.stubGlobal("crypto", {
      subtle: {
        digest: crypto.subtle.digest.bind(crypto.subtle),
        timingSafeEqual: (a: ArrayBuffer, b: ArrayBuffer) =>
          timingSafeEqual(new Uint8Array(a), new Uint8Array(b)),
      },
    });
    dispatch = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", dispatch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects methods other than POST", async () => {
    const response = await call(
      new Request("https://webmention.alunduil.com/")
    );

    expect(response.status).toBe(405);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each([
    ["webmention secret", { GITHUB_DISPATCH_TOKEN: TOKEN }],
    ["dispatch token", { WEBMENTION_SECRET: SECRET }],
  ])("reports itself unconfigured without the %s", async (_, bindings) => {
    const response = await call(callback({ secret: SECRET }), bindings);

    expect(response.status).toBe(503);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("rejects a body that isn't JSON", async () => {
    const response = await call(callback("secret=shared-secret"));

    expect(response.status).toBe(400);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each([
    ["is missing", {}],
    ["is wrong", { secret: "guess" }],
    ["is a prefix of the real one", { secret: "shared" }],
    ["isn't a string", { secret: 42 }],
    ["comes in a JSON null", null],
  ])("rejects a callback whose secret %s", async (_, body) => {
    const response = await call(callback(body));

    expect(response.status).toBe(403);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it.each([
    ["new mention", { post: { type: "entry" } }],
    ["deleted mention", { deleted: true }],
  ])("dispatches on a %s", async (_, shape) => {
    const response = await call(
      callback({
        secret: SECRET,
        source: "https://example.com/reply",
        target: "https://blog.alunduil.com/posts/example/",
        private: false,
        ...shape,
      })
    );

    expect(response.status).toBe(204);
    expect(dispatch).toHaveBeenCalledOnce();
    const [url, init] = dispatch.mock.calls[0];
    expect(url).toBe(
      "https://api.github.com/repos/alunduil/blog.alunduil.com/dispatches"
    );
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe(`Bearer ${TOKEN}`);
    expect(JSON.parse(init.body)).toEqual({ event_type: "webmention" });
  });

  it("reports GitHub rejecting the dispatch as a bad gateway", async () => {
    dispatch.mockResolvedValueOnce(new Response(null, { status: 401 }));

    const response = await call(callback({ secret: SECRET }));

    expect(response.status).toBe(502);
    expect(await response.text()).toContain("401");
  });
});
