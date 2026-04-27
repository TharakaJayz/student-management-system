import { AppError } from "../common/errors.ts"
import { StudentClassModel } from "./student-class.model.ts"
import type { StudentClassRepository, StudentClassRow } from "./student-class.repository.ts"

export class StudentClassService {
  constructor(private readonly studentClassRepository: StudentClassRepository) {}

  async createStudentClasses(params: {
    items: Array<{ studentId: string; classId: string; isActive: boolean }>
  }): Promise<StudentClassRow[]> {
    const created: StudentClassRow[] = []

    for (const item of params.items) {
      const studentClass = StudentClassModel.create(item)
      const row = await this.studentClassRepository.create(studentClass)
      created.push(row)
    }

    return created
  }

  async deleteStudentClasses(params: {
    items: Array<{ studentId: string; classId: string }>
  }): Promise<StudentClassRow[]> {
    const deletedRows: StudentClassRow[] = []

    for (const item of params.items) {
      const deleted = await this.studentClassRepository.delete({
        studentId: item.studentId,
        classId: item.classId,
      })

      if (!deleted) {
        throw new AppError("Student class assignment not found", 404)
      }

      deletedRows.push(deleted)
    }

    return deletedRows
  }
}
