import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { StudentClassFacade } from "../_shared/student-class/student-class.facade.ts"
import { SupabaseStudentClassRepository } from "../_shared/student-class/student-class.repository.ts"
import { DeleteStudentClassesRequestSchema } from "../_shared/student-class/student-class.schema.ts"
import { StudentClassService } from "../_shared/student-class/student-class.service.ts"

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

    const parsedBody = DeleteStudentClassesRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const studentClassFacade = new StudentClassFacade(
      new StudentClassService(new SupabaseStudentClassRepository(userClient)),
    )

    const studentClasses = await studentClassFacade.deleteStudentClasses({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ studentClasses }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
