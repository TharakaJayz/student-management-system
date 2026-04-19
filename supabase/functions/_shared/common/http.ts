/** Default CORS headers for edge functions that accept browser requests with Bearer auth. */
export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

export function withCors(res: Response): Response {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(corsHeaders)) {
    headers.set(k, v)
  }
  return new Response(res.body, { status: res.status, headers })
}

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")
  return new Response(JSON.stringify(data), { ...init, headers })
}

export function methodNotAllowed() {
  return json({ error: "Method not allowed" }, { status: 405 })
}
