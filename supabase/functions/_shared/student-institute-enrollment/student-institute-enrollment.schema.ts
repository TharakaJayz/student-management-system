import { z } from "zod"

export const CreateStudentInstituteEnrollmentRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  isActive: z.boolean().optional().default(true),
})

export const DeleteStudentInstituteEnrollmentRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
})

export type CreateStudentInstituteEnrollmentRequest = z.infer<typeof CreateStudentInstituteEnrollmentRequestSchema>
export type DeleteStudentInstituteEnrollmentRequest = z.infer<typeof DeleteStudentInstituteEnrollmentRequestSchema>
