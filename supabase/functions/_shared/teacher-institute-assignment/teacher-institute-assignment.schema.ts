import { z } from "zod"

export const CreateTeacherInstituteAssignmentRequestSchema = z.object({
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  isActive: z.boolean().optional().default(true),
})

export const UpdateTeacherInstituteAssignmentRequestSchema = z.object({
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  isActive: z.boolean(),
})

export const DeleteTeacherInstituteAssignmentRequestSchema = z.object({
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
})

export type CreateTeacherInstituteAssignmentRequest = z.infer<typeof CreateTeacherInstituteAssignmentRequestSchema>
export type UpdateTeacherInstituteAssignmentRequest = z.infer<typeof UpdateTeacherInstituteAssignmentRequestSchema>
export type DeleteTeacherInstituteAssignmentRequest = z.infer<typeof DeleteTeacherInstituteAssignmentRequestSchema>
