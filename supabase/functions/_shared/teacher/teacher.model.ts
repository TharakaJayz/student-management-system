import { AppError } from "../common/errors.ts"

export class TeacherModel {
  readonly name: string
  readonly mobile: string
  readonly subjectId: string

  private constructor(params: { name: string; mobile: string; subjectId: string }) {
    this.name = params.name
    this.mobile = params.mobile
    this.subjectId = params.subjectId
  }

  static create(params: { name: string; mobile: string; subjectId: string }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length < 2) {
      throw new AppError("Teacher name must be at least 2 characters", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("Teacher name must be at most 200 characters", 400)
    }

    const normalizedMobile = params.mobile.trim()
    if (normalizedMobile.length < 5) {
      throw new AppError("mobile is required", 400)
    }
    if (normalizedMobile.length > 30) {
      throw new AppError("mobile must be at most 30 characters", 400)
    }

    return new TeacherModel({
      name: normalizedName,
      mobile: normalizedMobile,
      subjectId: params.subjectId,
    })
  }
}
