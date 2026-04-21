import { z } from "zod"

export const CreateTeacherRequestSchema = z.object({
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  mobile: z.string().trim().min(5, "mobile is required").max(30, "mobile is too long"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
})

export const UpdateTeacherRequestSchema = z.object({
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  mobile: z.string().trim().min(5, "mobile is required").max(30, "mobile is too long"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
})

export type CreateTeacherRequest = z.infer<typeof CreateTeacherRequestSchema>
export type UpdateTeacherRequest = z.infer<typeof UpdateTeacherRequestSchema>
