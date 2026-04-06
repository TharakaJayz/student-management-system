import type { UpsertOwnerProfileRequest } from "./owner.schema.ts"
import type { OwnerService } from "./owner.service.ts"

export class OwnerFacade {
  constructor(private readonly ownerService: OwnerService) {}

  upsertOwnerProfile(params: { body: UpsertOwnerProfileRequest; authenticatedUserId: string }) {
    return this.ownerService.upsertOwnerProfile({
      userId: params.authenticatedUserId,
      name: params.body.name,
      mobile: params.body.mobile,
    })
  }
}
