import { z } from "zod"

export const UpsertOwnerProfileRequestSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  mobile: z.string().trim().min(1, "mobile is required").max(30, "mobile is too long"),
})

export type UpsertOwnerProfileRequest = z.infer<typeof UpsertOwnerProfileRequestSchema>
