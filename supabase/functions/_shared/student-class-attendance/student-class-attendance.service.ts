import { AppError } from "../common/errors.ts"
import { StudentClassAttendanceModel } from "./student-class-attendance.model.ts"
import type {
  StudentClassAttendanceRepository,
  StudentClassAttendanceRow,
} from "./student-class-attendance.repository.ts"

export class StudentClassAttendanceService {
  constructor(private readonly attendanceRepository: StudentClassAttendanceRepository) {}

  async updateStudentClassAttendance(params: {
    studentId: string
    classId: string
    attendanceDate: number
    isPresent: boolean
    isActive: boolean
  }): Promise<StudentClassAttendanceRow> {
    const attendance = StudentClassAttendanceModel.create(params)
    const updated = await this.attendanceRepository.update(attendance)

    if (!updated) {
      throw new AppError("Student class attendance not found", 404)
    }

    return updated
  }
}
