import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { StudentInstituteEnrollmentFacade } from "../_shared/student-institute-enrollment/student-institute-enrollment.facade.ts"
import { SupabaseStudentInstituteEnrollmentRepository } from "../_shared/student-institute-enrollment/student-institute-enrollment.repository.ts"
import { CreateStudentInstituteEnrollmentRequestSchema } from "../_shared/student-institute-enrollment/student-institute-enrollment.schema.ts"
import { StudentInstituteEnrollmentService } from "../_shared/student-institute-enrollment/student-institute-enrollment.service.ts"

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

    const parsedBody = CreateStudentInstituteEnrollmentRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const enrollmentFacade = new StudentInstituteEnrollmentFacade(
      new StudentInstituteEnrollmentService(
        new SupabaseStudentInstituteEnrollmentRepository(userClient),
      ),
    )

    const studentInstituteEnrollment = await enrollmentFacade.createStudentInstituteEnrollment({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ studentInstituteEnrollment }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
