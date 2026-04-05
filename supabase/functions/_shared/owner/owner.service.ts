import { AppError } from "../common/errors.ts"
import { OwnerProfileModel } from "./owner.model.ts"
import type { OwnerRepository, OwnerRow } from "./owner.repository.ts"

export class OwnerService {
  constructor(private readonly ownerRepository: OwnerRepository) {}

  /**
   * Validates and normalizes mobile (length, allowed characters).
   * Throws AppError on invalid input.
   */
  validateMobile(raw: string): string {
    const mobile = raw.trim()
    if (mobile.length < 8) {
      throw new AppError("mobile is too short", 400)
    }
    if (mobile.length > 20) {
      throw new AppError("mobile is too long", 400)
    }
    if (!/^[0-9+()\s-]+$/.test(mobile)) {
      throw new AppError("mobile contains invalid characters", 400)
    }
    return mobile
  }

  async upsertOwnerProfile(params: { userId: string; name: string; mobile: string }): Promise<OwnerRow> {
    const normalizedMobile = this.validateMobile(params.mobile)
    const model = OwnerProfileModel.create({ name: params.name, mobile: normalizedMobile })

    const existing = await this.ownerRepository.findById(params.userId)
    if (existing) {
      return this.ownerRepository.update(params.userId, { name: model.name, mobile: model.mobile })
    }

    return this.ownerRepository.insert({
      id: params.userId,
      name: model.name,
      mobile: model.mobile,
    })
  }
}
