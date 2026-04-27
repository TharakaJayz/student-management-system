import type { CreateStudentSubjectsRequest, DeleteStudentSubjectsRequest } from "./student-subject.schema.ts"
import type { StudentSubjectService } from "./student-subject.service.ts"

export class StudentSubjectFacade {
  constructor(private readonly studentSubjectService: StudentSubjectService) {}

  createStudentSubjects(params: { body: CreateStudentSubjectsRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.studentSubjectService.createStudentSubjects({
      items: params.body.map((item) => ({
        studentId: item.studentId,
        subjectId: item.subjectId,
        isActive: item.isActive,
      })),
    })
  }

  deleteStudentSubjects(params: { body: DeleteStudentSubjectsRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.studentSubjectService.deleteStudentSubjects({
      items: params.body.map((item) => ({
        studentId: item.studentId,
        subjectId: item.subjectId,
      })),
    })
  }
}
