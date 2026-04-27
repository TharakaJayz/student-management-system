import { AppError } from "../common/errors.ts"

export class ClassModel {
  readonly name: string
  readonly classRoomId: string
  readonly instituteId: string
  readonly teacherId: string
  readonly subjectId: string
  readonly grade: string
  readonly startTime: number
  readonly endTime: number
  readonly frequency: "WEEKLY" | "OTHER"
  readonly day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
  readonly classFee: number

  private constructor(params: {
    name: string
    classRoomId: string
    instituteId: string
    teacherId: string
    subjectId: string
    grade: string
    startTime: number
    endTime: number
    frequency: "WEEKLY" | "OTHER"
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    classFee: number
  }) {
    this.name = params.name
    this.classRoomId = params.classRoomId
    this.instituteId = params.instituteId
    this.teacherId = params.teacherId
    this.subjectId = params.subjectId
    this.grade = params.grade
    this.startTime = params.startTime
    this.endTime = params.endTime
    this.frequency = params.frequency
    this.day = params.day
    this.classFee = params.classFee
  }

  static create(params: {
    name: string
    classRoomId: string
    instituteId: string
    teacherId: string
    subjectId: string
    grade: string
    startTime: number
    endTime: number
    frequency: "WEEKLY" | "OTHER"
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    classFee: number
  }) {
    if (!params.instituteId || params.instituteId.trim().length === 0) {
      throw new AppError("instituteId is required", 400)
    }

    const mutable = ClassModel.forMutableFields(params)

    return new ClassModel({
      ...mutable,
      instituteId: params.instituteId.trim(),
    })
  }

  static forMutableFields(params: {
    name: string
    classRoomId: string
    teacherId: string
    subjectId: string
    grade: string
    startTime: number
    endTime: number
    frequency: "WEEKLY" | "OTHER"
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    classFee: number
  }) {
    const name = params.name.trim()
    if (name.length === 0 || name.length > 200) {
      throw new AppError("Class name must be 1-200 characters", 400)
    }

    const grade = params.grade.trim()
    if (grade.length === 0 || grade.length > 100) {
      throw new AppError("grade must be 1-100 characters", 400)
    }

    if (!params.classRoomId || params.classRoomId.trim().length === 0) {
      throw new AppError("classRoomId is required", 400)
    }
    if (!params.teacherId || params.teacherId.trim().length === 0) {
      throw new AppError("teacherId is required", 400)
    }
    if (!params.subjectId || params.subjectId.trim().length === 0) {
      throw new AppError("subjectId is required", 400)
    }

    if (!Number.isInteger(params.startTime) || params.startTime < 0) {
      throw new AppError("startTime must be a non-negative integer", 400)
    }
    if (!Number.isInteger(params.endTime) || params.endTime < 0) {
      throw new AppError("endTime must be a non-negative integer", 400)
    }
    if (params.endTime <= params.startTime) {
      throw new AppError("endTime must be greater than startTime", 400)
    }

    if (params.classFee < 0) {
      throw new AppError("classFee must be non-negative", 400)
    }

    return {
      name,
      classRoomId: params.classRoomId.trim(),
      teacherId: params.teacherId.trim(),
      subjectId: params.subjectId.trim(),
      grade,
      startTime: params.startTime,
      endTime: params.endTime,
      frequency: params.frequency,
      day: params.day,
      classFee: params.classFee,
    }
  }
}
