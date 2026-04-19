import { z } from "zod"

export const CreateClassRoomRequestSchema = z.object({
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  location: z.string().trim().min(1, "location is required").max(500, "location is too long"),
  capacity: z.number().int().min(0, "capacity must be at least 0"),
  isAirConditioned: z.boolean(),
})

export const UpdateClassRoomRequestSchema = z.object({
  classRoomId: z.string().uuid("classRoomId must be a valid UUID"),
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  location: z.string().trim().min(1, "location is required").max(500, "location is too long"),
  capacity: z.number().int().min(0, "capacity must be at least 0"),
  isAirConditioned: z.boolean(),
})

export type CreateClassRoomRequest = z.infer<typeof CreateClassRoomRequestSchema>
export type UpdateClassRoomRequest = z.infer<typeof UpdateClassRoomRequestSchema>
