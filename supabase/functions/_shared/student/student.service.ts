import { AppError } from "../common/errors.ts"
import type { StudentRepository, StudentRow } from "./student.repository.ts"
import { StudentModel } from "./student.model.ts"

export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(params: {
    ownerId: string
    name: string
    age: number
    grade: string
    imageUrl: string
  }): Promise<StudentRow> {
    const instituteId = await this.studentRepository.findInstituteIdByOwnerId(params.ownerId)
    if (!instituteId) {
      throw new AppError("Institute not found for this owner", 404)
    }

    const student = StudentModel.create(params)
    const created = await this.studentRepository.create(student)

    const isAlreadyEnrolled = await this.studentRepository.isStudentEnrolledInInstitute({
      studentId: created.id,
      instituteId,
    })

    if (!isAlreadyEnrolled) {
      await this.studentRepository.createStudentInstituteEnrollment({
        studentId: created.id,
        instituteId,
      })
    }

    return created
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
