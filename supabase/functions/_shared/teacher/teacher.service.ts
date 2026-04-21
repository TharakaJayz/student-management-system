import { AppError } from "../common/errors.ts"
import type { InstituteRepository } from "../institute/institute.repository.ts"
import { TeacherModel } from "./teacher.model.ts"
import type { TeacherRepository, TeacherRow } from "./teacher.repository.ts"

export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly instituteRepository: InstituteRepository,
  ) {}

  async createTeacher(params: {
    ownerId: string
    name: string
    mobile: string
    subjectId: string
  }): Promise<TeacherRow> {
    const instituteId = await this.instituteRepository.findInstituteIdByOwnerId(params.ownerId)
    if (!instituteId) {
      throw new AppError("Institute not found for this owner", 404)
    }

    const teacher = TeacherModel.create(params)
    const created = await this.teacherRepository.create(teacher)

    const isAlreadyAssigned = await this.teacherRepository.isTeacherAssignedToInstitute({
      teacherId: created.id,
      instituteId,
    })

    if (!isAlreadyAssigned) {
      await this.teacherRepository.createTeacherInstituteAssignment({
        teacherId: created.id,
        instituteId,
      })
    }

    return created
  }

  async updateTeacher(params: {
    teacherId: string
    name: string
    mobile: string
    subjectId: string
  }): Promise<TeacherRow> {
    const teacher = TeacherModel.create({
      name: params.name,
      mobile: params.mobile,
      subjectId: params.subjectId,
    })

    const updated = await this.teacherRepository.update({
      teacherId: params.teacherId,
      name: teacher.name,
      mobile: teacher.mobile,
      subjectId: teacher.subjectId,
    })

    if (!updated) {
      throw new AppError("Teacher not found", 404)
    }

    return updated
  }
}
