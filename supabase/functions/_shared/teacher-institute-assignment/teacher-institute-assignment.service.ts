import { AppError } from "../common/errors.ts"
import { TeacherInstituteAssignmentModel } from "./teacher-institute-assignment.model.ts"
import type {
  TeacherInstituteAssignmentRepository,
  TeacherInstituteAssignmentRow,
} from "./teacher-institute-assignment.repository.ts"

export class TeacherInstituteAssignmentService {
  constructor(private readonly assignmentRepository: TeacherInstituteAssignmentRepository) {}

  createTeacherInstituteAssignment(params: {
    teacherId: string
    instituteId: string
    isActive: boolean
  }): Promise<TeacherInstituteAssignmentRow> {
    const assignment = TeacherInstituteAssignmentModel.create(params)
    return this.assignmentRepository.create(assignment)
  }

  async updateTeacherInstituteAssignment(params: {
    teacherId: string
    instituteId: string
    isActive: boolean
  }): Promise<TeacherInstituteAssignmentRow> {
    const assignment = TeacherInstituteAssignmentModel.create(params)

    const updated = await this.assignmentRepository.update({
      teacherId: assignment.teacherId,
      instituteId: assignment.instituteId,
      isActive: assignment.isActive,
    })

    if (!updated) {
      throw new AppError("Teacher institute assignment not found", 404)
    }

    return updated
  }

  async deleteTeacherInstituteAssignment(params: {
    teacherId: string
    instituteId: string
  }): Promise<TeacherInstituteAssignmentRow> {
    const deleted = await this.assignmentRepository.delete({
      teacherId: params.teacherId,
      instituteId: params.instituteId,
    })

    if (!deleted) {
      throw new AppError("Teacher institute assignment not found", 404)
    }

    return deleted
  }
}
