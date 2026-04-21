import type { TeacherService } from "./teacher.service.ts"
import type { CreateTeacherRequest, UpdateTeacherRequest } from "./teacher.schema.ts"

export class TeacherFacade {
  constructor(private readonly teacherService: TeacherService) {}

  createTeacher(params: { body: CreateTeacherRequest; authenticatedUserId: string }) {
    return this.teacherService.createTeacher({
      ownerId: params.authenticatedUserId,
      name: params.body.name,
      mobile: params.body.mobile,
      subjectId: params.body.subjectId,
    })
  }

  updateTeacher(params: { body: UpdateTeacherRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.teacherService.updateTeacher({
      teacherId: params.body.teacherId,
      name: params.body.name,
      mobile: params.body.mobile,
      subjectId: params.body.subjectId,
    })
  }
}
