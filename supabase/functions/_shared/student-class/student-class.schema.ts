import { z } from "zod"

export const CreateStudentClassRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  classId: z.string().uuid("classId must be a valid UUID"),
  isActive: z.boolean().optional().default(true),
})

export const CreateStudentClassesRequestSchema = z.array(CreateStudentClassRequestSchema).min(
  1,
  "at least one student class is required",
)

export const DeleteStudentClassRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  classId: z.string().uuid("classId must be a valid UUID"),
})

export const DeleteStudentClassesRequestSchema = z.array(DeleteStudentClassRequestSchema).min(
  1,
  "at least one student class is required",
)

export type CreateStudentClassRequest = z.infer<typeof CreateStudentClassRequestSchema>
export type CreateStudentClassesRequest = z.infer<typeof CreateStudentClassesRequestSchema>
export type DeleteStudentClassRequest = z.infer<typeof DeleteStudentClassRequestSchema>
export type DeleteStudentClassesRequest = z.infer<typeof DeleteStudentClassesRequestSchema>
