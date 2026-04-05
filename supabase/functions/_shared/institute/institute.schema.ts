import { z } from "zod"

export const CreateInstituteRequestSchema = z.object({
  name: z.string().trim().min(2, "name is required").max(200, "name is too long"),
  address: z.string().trim().min(1, "address is required").max(500, "address is too long"),
  ownerId: z.string().uuid("ownerId must be a valid UUID"),
})

export type CreateInstituteRequest = z.infer<typeof CreateInstituteRequestSchema>
