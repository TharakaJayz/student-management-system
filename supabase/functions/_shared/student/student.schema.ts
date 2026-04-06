import { z } from "zod"

export const CreateStudentRequestSchema = z.object({
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  age: z.number().int().min(0, "age must be at least 0").max(150, "age must be at most 150"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  imageUrl: z.string().trim().max(2000, "imageUrl is too long").optional().default(""),
})

export const UpdateStudentRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  age: z.number().int().min(0, "age must be at least 0").max(150, "age must be at most 150"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  imageUrl: z.string().trim().max(2000, "imageUrl is too long").optional().default(""),
})

export type CreateStudentRequest = z.infer<typeof CreateStudentRequestSchema>
export type UpdateStudentRequest = z.infer<typeof UpdateStudentRequestSchema>
