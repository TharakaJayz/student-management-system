import { z } from "zod"

/** Create when `subjectId` is omitted; update when `subjectId` is a valid UUID. */
export const UpsertSubjectRequestSchema = z.object({
  subjectId: z.string().uuid("subjectId must be a valid UUID").optional(),
  name: z.string().trim().min(1, "name is required").max(200, "name is too long"),
  medium: z.enum(["ENGLISH", "SINHALA"]),
  isActive: z.boolean().optional().default(true),
})

export type UpsertSubjectRequest = z.infer<typeof UpsertSubjectRequestSchema>
