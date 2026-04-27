import { z } from "zod"

const dayEnum = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
])

const frequencyEnum = z.enum(["WEEKLY", "OTHER"])

export const CreateClassRequestSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  classRoomId: z.string().uuid("classRoomId must be a valid UUID"),
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  startTime: z.number().int().min(0, "startTime must be a non-negative integer"),
  endTime: z.number().int().min(0, "endTime must be a non-negative integer"),
  frequency: frequencyEnum,
  day: dayEnum,
  classFee: z.number().min(0, "classFee must be non-negative"),
})

export const UpdateClassRequestSchema = z.object({
  classId: z.string().uuid("classId must be a valid UUID"),
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  classRoomId: z.string().uuid("classRoomId must be a valid UUID"),
  teacherId: z.string().uuid("teacherId must be a valid UUID"),
  subjectId: z.string().uuid("subjectId must be a valid UUID"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  startTime: z.number().int().min(0, "startTime must be a non-negative integer"),
  endTime: z.number().int().min(0, "endTime must be a non-negative integer"),
  frequency: frequencyEnum,
  day: dayEnum,
  classFee: z.number().min(0, "classFee must be non-negative"),
})

export type CreateClassRequest = z.infer<typeof CreateClassRequestSchema>
export type UpdateClassRequest = z.infer<typeof UpdateClassRequestSchema>
