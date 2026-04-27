import { AppError } from "../common/errors.ts"
import { StudentInstituteEnrollmentModel } from "./student-institute-enrollment.model.ts"
import type {
  StudentInstituteEnrollmentRepository,
  StudentInstituteEnrollmentRow,
} from "./student-institute-enrollment.repository.ts"

export class StudentInstituteEnrollmentService {
  constructor(private readonly enrollmentRepository: StudentInstituteEnrollmentRepository) {}

  createStudentInstituteEnrollment(params: {
    studentId: string
    instituteId: string
    isActive: boolean
  }): Promise<StudentInstituteEnrollmentRow> {
    const enrollment = StudentInstituteEnrollmentModel.create(params)
    return this.enrollmentRepository.create(enrollment)
  }

  async deleteStudentInstituteEnrollment(params: {
    studentId: string
    instituteId: string
  }): Promise<StudentInstituteEnrollmentRow> {
    const deleted = await this.enrollmentRepository.delete({
      studentId: params.studentId,
      instituteId: params.instituteId,
    })

    if (!deleted) {
      throw new AppError("Student institute enrollment not found", 404)
    }

    return deleted
  }
}
