import { AppError } from "../common/errors.ts"
import { SubjectModel } from "./subject.model.ts"
import type { SubjectRepository, SubjectRow } from "./subject.repository.ts"

export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async upsertSubject(params: {
    subjectId?: string
    name: string
    medium: "ENGLISH" | "SINHALA"
    isActive: boolean
  }): Promise<SubjectRow> {
    const subject = SubjectModel.create({
      name: params.name,
      medium: params.medium,
      isActive: params.isActive,
    })

    if (params.subjectId) {
      const updated = await this.subjectRepository.update({
        subjectId: params.subjectId,
        name: subject.name,
        medium: subject.medium,
        isActive: subject.isActive,
      })

      if (!updated) {
        throw new AppError("Subject not found", 404)
      }

      return updated
    }

    return this.subjectRepository.create(subject)
  }
}
