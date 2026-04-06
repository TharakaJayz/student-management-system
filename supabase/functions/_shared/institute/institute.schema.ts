import { z } from "zod"

/** Body for create-institute; `ownerId` is taken from the authenticated user (JWT). */
export const CreateInstituteRequestSchema = z.object({
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  address: z.string().trim().min(1, "address is required").max(500, "address is too long"),
})

export const UpdateInstituteRequestSchema = z.object({
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  address: z.string().trim().min(1, "address is required").max(500, "address is too long"),
})

export type CreateInstituteRequest = z.infer<typeof CreateInstituteRequestSchema>
export type UpdateInstituteRequest = z.infer<typeof UpdateInstituteRequestSchema>
