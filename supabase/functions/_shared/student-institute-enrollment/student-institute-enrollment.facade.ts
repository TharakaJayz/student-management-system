import type {
  CreateStudentInstituteEnrollmentRequest,
  DeleteStudentInstituteEnrollmentRequest,
} from "./student-institute-enrollment.schema.ts"
import type { StudentInstituteEnrollmentService } from "./student-institute-enrollment.service.ts"

export class StudentInstituteEnrollmentFacade {
  constructor(private readonly enrollmentService: StudentInstituteEnrollmentService) {}

  createStudentInstituteEnrollment(params: {
    body: CreateStudentInstituteEnrollmentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.enrollmentService.createStudentInstituteEnrollment({
      studentId: params.body.studentId,
      instituteId: params.body.instituteId,
      isActive: params.body.isActive,
    })
  }

  deleteStudentInstituteEnrollment(params: {
    body: DeleteStudentInstituteEnrollmentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.enrollmentService.deleteStudentInstituteEnrollment({
      studentId: params.body.studentId,
      instituteId: params.body.instituteId,
    })
  }
}
