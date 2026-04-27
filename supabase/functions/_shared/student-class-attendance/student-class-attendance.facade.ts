import type { UpdateStudentClassAttendanceRequest } from "./student-class-attendance.schema.ts"
import type { StudentClassAttendanceService } from "./student-class-attendance.service.ts"

export class StudentClassAttendanceFacade {
  constructor(private readonly attendanceService: StudentClassAttendanceService) {}

  updateStudentClassAttendance(params: {
    body: UpdateStudentClassAttendanceRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.attendanceService.updateStudentClassAttendance({
      studentId: params.body.studentId,
      classId: params.body.classId,
      attendanceDate: params.body.attendanceDate,
      isPresent: params.body.isPresent,
      isActive: params.body.isActive,
    })
  }
}
