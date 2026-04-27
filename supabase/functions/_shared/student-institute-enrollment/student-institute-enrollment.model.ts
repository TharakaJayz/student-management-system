import { AppError } from "../common/errors.ts"

export class StudentInstituteEnrollmentModel {
  readonly studentId: string
  readonly instituteId: string
  readonly isActive: boolean

  private constructor(params: { studentId: string; instituteId: string; isActive: boolean }) {
    this.studentId = params.studentId
    this.instituteId = params.instituteId
    this.isActive = params.isActive
  }

  static create(params: { studentId: string; instituteId: string; isActive: boolean }) {
    if (!params.studentId || params.studentId.trim().length === 0) {
      throw new AppError("studentId is required", 400)
    }
    if (!params.instituteId || params.instituteId.trim().length === 0) {
      throw new AppError("instituteId is required", 400)
    }

    return new StudentInstituteEnrollmentModel({
      studentId: params.studentId.trim(),
      instituteId: params.instituteId.trim(),
      isActive: params.isActive,
    })
  }
}
