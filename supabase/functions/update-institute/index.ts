import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { InstituteFacade } from "../_shared/institute/institute.facade.ts"
import { SupabaseInstituteRepository } from "../_shared/institute/institute.repository.ts"
import { UpdateInstituteRequestSchema } from "../_shared/institute/institute.schema.ts"
import { InstituteService } from "../_shared/institute/institute.service.ts"

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

    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      return withCors(json({ error: "Invalid JSON body" }, { status: 400 }))
    }

    const parsedBody = UpdateInstituteRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const instituteFacade = new InstituteFacade(
      new InstituteService(new SupabaseInstituteRepository(userClient)),
    )

    const institute = await instituteFacade.updateInstitute({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ institute }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
