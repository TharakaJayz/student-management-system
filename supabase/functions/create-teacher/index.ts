import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { SupabaseInstituteRepository } from "../_shared/institute/institute.repository.ts"
import { TeacherFacade } from "../_shared/teacher/teacher.facade.ts"
import { SupabaseTeacherRepository } from "../_shared/teacher/teacher.repository.ts"
import { CreateTeacherRequestSchema } from "../_shared/teacher/teacher.schema.ts"
import { TeacherService } from "../_shared/teacher/teacher.service.ts"

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

    const parsedBody = CreateTeacherRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const teacherFacade = new TeacherFacade(
      new TeacherService(
        new SupabaseTeacherRepository(userClient),
        new SupabaseInstituteRepository(userClient),
      ),
    )

    const teacher = await teacherFacade.createTeacher({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ teacher }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
