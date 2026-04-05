import { AppError } from "../common/errors.ts"

export class InstituteModel {
  readonly name: string
  readonly address: string
  readonly ownerId: string

  private constructor(params: { name: string; address: string; ownerId: string }) {
    this.name = params.name
    this.address = params.address
    this.ownerId = params.ownerId
  }

  static create(params: { name: string; address: string; ownerId: string }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length < 2) {
      throw new AppError("Institute name must be at least 2 characters", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("Institute name must be at most 200 characters", 400)
    }

    const normalizedAddress = params.address.trim()
    if (normalizedAddress.length === 0) {
      throw new AppError("address is required", 400)
    }
    if (normalizedAddress.length > 500) {
      throw new AppError("address must be at most 500 characters", 400)
    }

    if (!params.ownerId || params.ownerId.trim().length === 0) {
      throw new AppError("ownerId is required", 400)
    }

    return new InstituteModel({
      name: normalizedName,
      address: normalizedAddress,
      ownerId: params.ownerId.trim(),
    })
  }
}
