import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { TeacherInstituteAssignmentFacade } from "../_shared/teacher-institute-assignment/teacher-institute-assignment.facade.ts"
import { SupabaseTeacherInstituteAssignmentRepository } from "../_shared/teacher-institute-assignment/teacher-institute-assignment.repository.ts"
import { CreateTeacherInstituteAssignmentRequestSchema } from "../_shared/teacher-institute-assignment/teacher-institute-assignment.schema.ts"
import { TeacherInstituteAssignmentService } from "../_shared/teacher-institute-assignment/teacher-institute-assignment.service.ts"

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

    const parsedBody = CreateTeacherInstituteAssignmentRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const assignmentFacade = new TeacherInstituteAssignmentFacade(
      new TeacherInstituteAssignmentService(
        new SupabaseTeacherInstituteAssignmentRepository(userClient),
      ),
    )

    const teacherInstituteAssignment = await assignmentFacade.createTeacherInstituteAssignment({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ teacherInstituteAssignment }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
