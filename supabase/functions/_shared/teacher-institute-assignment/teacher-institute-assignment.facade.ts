import type {
  CreateTeacherInstituteAssignmentRequest,
  DeleteTeacherInstituteAssignmentRequest,
  UpdateTeacherInstituteAssignmentRequest,
} from "./teacher-institute-assignment.schema.ts"
import type { TeacherInstituteAssignmentService } from "./teacher-institute-assignment.service.ts"

export class TeacherInstituteAssignmentFacade {
  constructor(private readonly assignmentService: TeacherInstituteAssignmentService) {}

  createTeacherInstituteAssignment(params: {
    body: CreateTeacherInstituteAssignmentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.assignmentService.createTeacherInstituteAssignment({
      teacherId: params.body.teacherId,
      instituteId: params.body.instituteId,
      isActive: params.body.isActive,
    })
  }

  updateTeacherInstituteAssignment(params: {
    body: UpdateTeacherInstituteAssignmentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.assignmentService.updateTeacherInstituteAssignment({
      teacherId: params.body.teacherId,
      instituteId: params.body.instituteId,
      isActive: params.body.isActive,
    })
  }

  deleteTeacherInstituteAssignment(params: {
    body: DeleteTeacherInstituteAssignmentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.assignmentService.deleteTeacherInstituteAssignment({
      teacherId: params.body.teacherId,
      instituteId: params.body.instituteId,
    })
  }
}
