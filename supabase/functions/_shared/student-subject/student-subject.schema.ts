import { z } from "zod"

export const CreateStudentSubjectRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
  isActive: z.boolean().optional().default(true),
})

export const DeleteStudentSubjectRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
})

export const CreateStudentSubjectsRequestSchema = z.array(CreateStudentSubjectRequestSchema).min(
  1,
  "at least one student subject is required",
)

export const DeleteStudentSubjectsRequestSchema = z.array(DeleteStudentSubjectRequestSchema).min(
  1,
  "at least one student subject is required",
)

export type CreateStudentSubjectRequest = z.infer<typeof CreateStudentSubjectRequestSchema>
export type DeleteStudentSubjectRequest = z.infer<typeof DeleteStudentSubjectRequestSchema>
export type CreateStudentSubjectsRequest = z.infer<typeof CreateStudentSubjectsRequestSchema>
export type DeleteStudentSubjectsRequest = z.infer<typeof DeleteStudentSubjectsRequestSchema>
