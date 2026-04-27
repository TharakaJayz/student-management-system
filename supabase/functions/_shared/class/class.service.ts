import { AppError } from "../common/errors.ts"
import type { InstituteRepository } from "../institute/institute.repository.ts"
import { ClassModel } from "./class.model.ts"
import type { ClassRepository, ClassRow } from "./class.repository.ts"

export class ClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly instituteRepository: InstituteRepository,
  ) {}

  async createClass(params: {
    ownerId: string
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
  }): Promise<ClassRow> {
    const instituteId = await this.instituteRepository.findInstituteIdByOwnerId(params.ownerId)
    if (!instituteId) {
      throw new AppError("Institute not found", 404)
    }

    const cls = ClassModel.create({
      name: params.name,
      classRoomId: params.classRoomId,
      instituteId,
      teacherId: params.teacherId,
      subjectId: params.subjectId,
      grade: params.grade,
      startTime: params.startTime,
      endTime: params.endTime,
      frequency: params.frequency,
      day: params.day,
      classFee: params.classFee,
    })

    return this.classRepository.create(cls)
  }

  async updateClass(params: {
    classId: string
    ownerId: string
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
  }): Promise<ClassRow> {
    const mutable = ClassModel.forMutableFields({
      name: params.name,
      classRoomId: params.classRoomId,
      teacherId: params.teacherId,
      subjectId: params.subjectId,
      grade: params.grade,
      startTime: params.startTime,
      endTime: params.endTime,
      frequency: params.frequency,
      day: params.day,
      classFee: params.classFee,
    })

    const updated = await this.classRepository.updateForOwner({
      classId: params.classId,
      ownerId: params.ownerId,
      ...mutable,
    })

    if (!updated) {
      throw new AppError("Class not found", 404)
    }

    return updated
  }
}
