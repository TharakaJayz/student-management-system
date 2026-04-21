import { AppError } from "../common/errors.ts"

export class TeacherInstituteAssignmentModel {
  readonly teacherId: string
  readonly instituteId: string
  readonly isActive: boolean

  private constructor(params: { teacherId: string; instituteId: string; isActive: boolean }) {
    this.teacherId = params.teacherId
    this.instituteId = params.instituteId
    this.isActive = params.isActive
  }

  static create(params: { teacherId: string; instituteId: string; isActive: boolean }) {
    if (!params.teacherId || params.teacherId.trim().length === 0) {
      throw new AppError("teacherId is required", 400)
    }
    if (!params.instituteId || params.instituteId.trim().length === 0) {
      throw new AppError("instituteId is required", 400)
    }

    return new TeacherInstituteAssignmentModel({
      teacherId: params.teacherId.trim(),
      instituteId: params.instituteId.trim(),
      isActive: params.isActive,
    })
  }
}
