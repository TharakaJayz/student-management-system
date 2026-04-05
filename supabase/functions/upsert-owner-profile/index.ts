import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { OwnerFacade } from "../_shared/owner/owner.facade.ts"
import { SupabaseOwnerRepository } from "../_shared/owner/owner.repository.ts"
import { OwnerService } from "../_shared/owner/owner.service.ts"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function withCors(res: Response): Response {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(corsHeaders)) {
    headers.set(k, v)
  }
  return new Response(res.body, { status: res.status, headers })
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }))
  }

  if (req.method !== "POST") {
    return withCors(methodNotAllowed())
  }

  try {
    const token = getBearerToken(req)
    const anon = createAnonClient()
    const user = await getAuthenticatedUser(anon, token)

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return withCors(json({ error: "Invalid JSON body" }, { status: 400 }))
    }

    const userClient = createUserClient(token)
    const ownerFacade = new OwnerFacade(
      new OwnerService(new SupabaseOwnerRepository(userClient)),
    )

    const owner = await ownerFacade.upsertOwnerProfile({
      body,
      authenticatedUserId: user.id,
    })

    return withCors(json({ owner }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
