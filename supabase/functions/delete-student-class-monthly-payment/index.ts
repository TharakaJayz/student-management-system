import { getAuthenticatedUser, getBearerToken } from "../_shared/common/auth.ts"
import { AppError, toErrorResponse } from "../_shared/common/errors.ts"
import { json, methodNotAllowed, withCors } from "../_shared/common/http.ts"
import { createAnonClient, createUserClient } from "../_shared/common/supabaseClient.ts"
import { StudentClassMonthlyPaymentFacade } from "../_shared/student-class-monthly-payment/student-class-monthly-payment.facade.ts"
import { SupabaseStudentClassMonthlyPaymentRepository } from "../_shared/student-class-monthly-payment/student-class-monthly-payment.repository.ts"
import { DeleteStudentClassMonthlyPaymentRequestSchema } from "../_shared/student-class-monthly-payment/student-class-monthly-payment.schema.ts"
import { StudentClassMonthlyPaymentService } from "../_shared/student-class-monthly-payment/student-class-monthly-payment.service.ts"

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

    const parsedBody = DeleteStudentClassMonthlyPaymentRequestSchema.safeParse(rawBody)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    const userClient = createUserClient(token)
    const paymentFacade = new StudentClassMonthlyPaymentFacade(
      new StudentClassMonthlyPaymentService(
        new SupabaseStudentClassMonthlyPaymentRepository(userClient),
      ),
    )

    const studentClassMonthlyPayment = await paymentFacade.deleteStudentClassMonthlyPayment({
      body: parsedBody.data,
      authenticatedUserId: user.id,
    })

    return withCors(json({ studentClassMonthlyPayment }))
  } catch (err) {
    const { body: errBody, status } = toErrorResponse(err)
    return withCors(json(errBody, { status }))
  }
})
