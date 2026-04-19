import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { SubjectFacade } from "../_shared/subject/subject.facade.ts"
import { SupabaseSubjectRepository } from "../_shared/subject/subject.repository.ts"
import { UpsertSubjectRequestSchema } from "../_shared/subject/subject.schema.ts"
import { SubjectService } from "../_shared/subject/subject.service.ts"

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

    const parsedBody = UpsertSubjectRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const subjectFacade = new SubjectFacade(
      new SubjectService(new SupabaseSubjectRepository(userClient)),
    )

    const subject = await subjectFacade.upsertSubject({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ subject }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
