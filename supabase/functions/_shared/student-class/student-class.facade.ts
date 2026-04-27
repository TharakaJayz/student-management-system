import type { StudentClassService } from "./student-class.service.ts"
import type { CreateStudentClassesRequest, DeleteStudentClassesRequest } from "./student-class.schema.ts"

export class StudentClassFacade {
  constructor(private readonly studentClassService: StudentClassService) {}

  createStudentClasses(params: { body: CreateStudentClassesRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.studentClassService.createStudentClasses({
      items: params.body.map((item) => ({
        studentId: item.studentId,
        classId: item.classId,
        isActive: item.isActive,
      })),
    })
  }

  deleteStudentClasses(params: { body: DeleteStudentClassesRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.studentClassService.deleteStudentClasses({
      items: params.body.map((item) => ({
        studentId: item.studentId,
        classId: item.classId,
      })),
    })
  }
}
