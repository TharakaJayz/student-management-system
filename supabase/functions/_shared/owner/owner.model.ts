import { AppError } from "../common/errors.ts"

export class OwnerProfileModel {
  readonly name: string
  readonly mobile: string

  private constructor(params: { name: string; mobile: string }) {
    this.name = params.name
    this.mobile = params.mobile
  }

  /** `mobile` must already be validated/normalized in the service. */
  static create(params: { name: string; mobile: string }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length < 1) {
      throw new AppError("name is required", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("name must be at most 200 characters", 400)
    }

    return new OwnerProfileModel({
      name: normalizedName,
      mobile: params.mobile,
    })
  }
}
