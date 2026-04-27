import { AppError } from "../common/errors.ts"
import { StudentSubjectModel } from "./student-subject.model.ts"
import type { StudentSubjectRepository, StudentSubjectRow } from "./student-subject.repository.ts"

export class StudentSubjectService {
  constructor(private readonly studentSubjectRepository: StudentSubjectRepository) {}

  async createStudentSubjects(params: {
    items: Array<{ studentId: string; subjectId: string; isActive: boolean }>
  }): Promise<StudentSubjectRow[]> {
    const created: StudentSubjectRow[] = []

    for (const item of params.items) {
      const studentSubject = StudentSubjectModel.create(item)
      const row = await this.studentSubjectRepository.create(studentSubject)
      created.push(row)
    }

    return created
  }

  async deleteStudentSubjects(params: {
    items: Array<{ studentId: string; subjectId: string }>
  }): Promise<StudentSubjectRow[]> {
    const deletedRows: StudentSubjectRow[] = []

    for (const item of params.items) {
      const deleted = await this.studentSubjectRepository.delete({
        studentId: item.studentId,
        subjectId: item.subjectId,
      })

      if (!deleted) {
        throw new AppError("Student subject assignment not found", 404)
      }

      deletedRows.push(deleted)
    }

    return deletedRows
  }
}
