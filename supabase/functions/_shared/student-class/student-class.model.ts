import { AppError } from "../common/errors.ts"

export class StudentClassModel {
  readonly studentId: string
  readonly classId: string
  readonly isActive: boolean

  private constructor(params: { studentId: string; classId: string; isActive: boolean }) {
    this.studentId = params.studentId
    this.classId = params.classId
    this.isActive = params.isActive
  }

  static create(params: { studentId: string; classId: string; isActive: boolean }) {
    if (!params.studentId || params.studentId.trim().length === 0) {
      throw new AppError("studentId is required", 400)
    }
    if (!params.classId || params.classId.trim().length === 0) {
      throw new AppError("classId is required", 400)
    }

    return new StudentClassModel({
      studentId: params.studentId.trim(),
      classId: params.classId.trim(),
      isActive: params.isActive,
    })
  }
}
