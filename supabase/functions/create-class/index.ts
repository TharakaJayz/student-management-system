import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { ClassFacade } from "../_shared/class/class.facade.ts"
import { SupabaseClassRepository } from "../_shared/class/class.repository.ts"
import { CreateClassRequestSchema } from "../_shared/class/class.schema.ts"
import { ClassService } from "../_shared/class/class.service.ts"
import { SupabaseInstituteRepository } from "../_shared/institute/institute.repository.ts"

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

    const parsedBody = CreateClassRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const classFacade = new ClassFacade(
      new ClassService(
        new SupabaseClassRepository(userClient),
        new SupabaseInstituteRepository(userClient),
      ),
    )

    const cls = await classFacade.createClass({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ class: cls }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
