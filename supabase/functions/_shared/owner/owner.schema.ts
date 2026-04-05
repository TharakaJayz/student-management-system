import { z } from "zod"

export const UpsertOwnerProfileRequestSchema = z.object({
  name: z.string(),
  mobile: z.string(),
})

export type UpsertOwnerProfileRequest = z.infer<typeof UpsertOwnerProfileRequestSchema>
