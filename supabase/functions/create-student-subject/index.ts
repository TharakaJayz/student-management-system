import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { StudentSubjectFacade } from "../_shared/student-subject/student-subject.facade.ts"
import { SupabaseStudentSubjectRepository } from "../_shared/student-subject/student-subject.repository.ts"
import { CreateStudentSubjectsRequestSchema } from "../_shared/student-subject/student-subject.schema.ts"
import { StudentSubjectService } from "../_shared/student-subject/student-subject.service.ts"

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

    const parsedBody = CreateStudentSubjectsRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const studentSubjectFacade = new StudentSubjectFacade(
      new StudentSubjectService(new SupabaseStudentSubjectRepository(userClient)),
    )

    const studentSubjects = await studentSubjectFacade.createStudentSubjects({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ studentSubjects }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
