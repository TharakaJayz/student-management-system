import type { CreateStudentRequest, UpdateStudentRequest } from "./student.schema.ts"
import type { StudentService } from "./student.service.ts"

export class StudentFacade {
  constructor(private readonly studentService: StudentService) {}

  createStudent(params: { body: CreateStudentRequest; authenticatedUserId: string }) {
    return this.studentService.createStudent({
      ownerId: params.authenticatedUserId,
      name: params.body.name,
      age: params.body.age,
      grade: params.body.grade,
      imageUrl: params.body.imageUrl,
    })
  }

  updateStudent(params: { body: UpdateStudentRequest; authenticatedUserId: string }) {
    return this.studentService.updateStudent({
      studentId: params.body.studentId,
      name: params.body.name,
      age: params.body.age,
      grade: params.body.grade,
      imageUrl: params.body.imageUrl,
    })
  }
}
