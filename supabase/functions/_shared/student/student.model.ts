import { AppError } from "../common/errors.ts"

export class StudentModel {
  readonly name: string
  readonly age: number
  readonly grade: string
  readonly imageUrl: string

  private constructor(params: { name: string; age: number; grade: string; imageUrl: string }) {
    this.name = params.name
    this.age = params.age
    this.grade = params.grade
    this.imageUrl = params.imageUrl
  }

  static create(params: { name: string; age: number; grade: string; imageUrl: string }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length < 2) {
      throw new AppError("Student name must be at least 2 characters", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("Student name must be at most 200 characters", 400)
    }

    if (!Number.isInteger(params.age) || params.age < 0 || params.age > 150) {
      throw new AppError("age must be between 0 and 150", 400)
    }

    const normalizedGrade = params.grade.trim()
    if (normalizedGrade.length === 0) {
      throw new AppError("grade is required", 400)
    }
    if (normalizedGrade.length > 100) {
      throw new AppError("grade must be at most 100 characters", 400)
    }

    const imageUrl = params.imageUrl.trim()
    if (imageUrl.length > 2000) {
      throw new AppError("imageUrl must be at most 2000 characters", 400)
    }

    return new StudentModel({
      name: normalizedName,
      age: params.age,
      grade: normalizedGrade,
      imageUrl,
    })
  }
}
