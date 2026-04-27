import { AppError } from "../common/errors.ts"

export class StudentSubjectModel {
  readonly studentId: string
  readonly subjectId: string
  readonly isActive: boolean

  private constructor(params: { studentId: string; subjectId: string; isActive: boolean }) {
    this.studentId = params.studentId
    this.subjectId = params.subjectId
    this.isActive = params.isActive
  }

  static create(params: { studentId: string; subjectId: string; isActive: boolean }) {
    if (!params.studentId || params.studentId.trim().length === 0) {
      throw new AppError("studentId is required", 400)
    }
    if (!params.subjectId || params.subjectId.trim().length === 0) {
      throw new AppError("subjectId is required", 400)
    }

    return new StudentSubjectModel({
      studentId: params.studentId.trim(),
      subjectId: params.subjectId.trim(),
      isActive: params.isActive,
    })
  }
}
