import { AppError } from "../common/errors.ts"

export class SubjectModel {
  readonly name: string
  readonly medium: "ENGLISH" | "SINHALA"
  readonly isActive: boolean

  private constructor(params: {
    name: string
    medium: "ENGLISH" | "SINHALA"
    isActive: boolean
  }) {
    this.name = params.name
    this.medium = params.medium
    this.isActive = params.isActive
  }

  static create(params: {
    name: string
    medium: "ENGLISH" | "SINHALA"
    isActive: boolean
  }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length === 0) {
      throw new AppError("Subject name is required", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("Subject name must be at most 200 characters", 400)
    }

    return new SubjectModel({
      name: normalizedName,
      medium: params.medium,
      isActive: params.isActive,
    })
  }
}
