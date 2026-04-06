import { AppError } from "../common/errors.ts"
import type { StudentRepository, StudentRow } from "./student.repository.ts"
import { StudentModel } from "./student.model.ts"

export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  createStudent(params: { name: string; age: number; grade: string; imageUrl: string }): Promise<StudentRow> {
    const student = StudentModel.create(params)
    return this.studentRepository.create(student)
  }

  async updateStudent(params: {
    studentId: string
    name: string
    age: number
    grade: string
    imageUrl: string
  }): Promise<StudentRow> {
    const student = StudentModel.create({
      name: params.name,
      age: params.age,
      grade: params.grade,
      imageUrl: params.imageUrl,
    })

    const updated = await this.studentRepository.update({
      studentId: params.studentId,
      name: student.name,
      age: student.age,
      grade: student.grade,
      imageUrl: student.imageUrl,
    })

    if (!updated) {
      throw new AppError("Student not found", 404)
    }

    return updated
  }
}
