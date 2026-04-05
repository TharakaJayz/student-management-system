import { AppError } from "../common/errors.ts"
import { UpsertOwnerProfileRequestSchema } from "./owner.schema.ts"
import type { OwnerService } from "./owner.service.ts"

export class OwnerFacade {
  constructor(private readonly ownerService: OwnerService) {}

  upsertOwnerProfile(params: { body: unknown; authenticatedUserId: string }) {
    const parsedBody = UpsertOwnerProfileRequestSchema.safeParse(params.body)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    return this.ownerService.upsertOwnerProfile({
      userId: params.authenticatedUserId,
      name: parsedBody.data.name,
      mobile: parsedBody.data.mobile,
    })
  }
}
