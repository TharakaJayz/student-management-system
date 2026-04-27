import { AppError } from "../common/errors.ts"

export class StudentClassAttendanceModel {
  readonly studentId: string
  readonly classId: string
  readonly attendanceDate: number
  readonly isPresent: boolean
  readonly isActive: boolean

  private constructor(params: {
    studentId: string
    classId: string
    attendanceDate: number
    isPresent: boolean
    isActive: boolean
  }) {
    this.studentId = params.studentId
    this.classId = params.classId
    this.attendanceDate = params.attendanceDate
    this.isPresent = params.isPresent
    this.isActive = params.isActive
  }

  static create(params: {
    studentId: string
    classId: string
    attendanceDate: number
    isPresent: boolean
    isActive: boolean
  }) {
    if (!params.studentId || params.studentId.trim().length === 0) {
      throw new AppError("studentId is required", 400)
    }
    if (!params.classId || params.classId.trim().length === 0) {
      throw new AppError("classId is required", 400)
    }
    if (!Number.isInteger(params.attendanceDate) || params.attendanceDate < 0) {
      throw new AppError("attendanceDate must be a non-negative integer", 400)
    }

    return new StudentClassAttendanceModel({
      studentId: params.studentId.trim(),
      classId: params.classId.trim(),
      attendanceDate: params.attendanceDate,
      isPresent: params.isPresent,
      isActive: params.isActive,
    })
  }
}
