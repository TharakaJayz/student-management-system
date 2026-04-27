import { z } from "zod"

export const UpdateStudentClassAttendanceRequestSchema = z.object({
  studentId: z.string().uuid("studentId must be a valid UUID"),
  classId: z.string().uuid("classId must be a valid UUID"),
  attendanceDate: z.number().int().min(0, "attendanceDate must be a non-negative integer"),
  isPresent: z.boolean(),
  isActive: z.boolean(),
})

export type UpdateStudentClassAttendanceRequest = z.infer<typeof UpdateStudentClassAttendanceRequestSchema>
