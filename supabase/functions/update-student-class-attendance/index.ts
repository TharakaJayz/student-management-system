import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { StudentClassAttendanceFacade } from "../_shared/student-class-attendance/student-class-attendance.facade.ts"
import { SupabaseStudentClassAttendanceRepository } from "../_shared/student-class-attendance/student-class-attendance.repository.ts"
import { UpdateStudentClassAttendanceRequestSchema } from "../_shared/student-class-attendance/student-class-attendance.schema.ts"
import { StudentClassAttendanceService } from "../_shared/student-class-attendance/student-class-attendance.service.ts"

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

    const parsedBody = UpdateStudentClassAttendanceRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const attendanceFacade = new StudentClassAttendanceFacade(
      new StudentClassAttendanceService(
        new SupabaseStudentClassAttendanceRepository(userClient),
      ),
    )

    const studentClassAttendance = await attendanceFacade.updateStudentClassAttendance({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ studentClassAttendance }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
