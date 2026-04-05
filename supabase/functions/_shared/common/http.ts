export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")
  return new Response(JSON.stringify(data), { ...init, headers })
}

export function methodNotAllowed() {
  return json({ error: "Method not allowed" }, { status: 405 })
}
