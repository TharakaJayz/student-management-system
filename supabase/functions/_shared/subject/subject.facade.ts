import type { UpsertSubjectRequest } from "./subject.schema.ts"
import type { SubjectService } from "./subject.service.ts"

export class SubjectFacade {
  constructor(private readonly subjectService: SubjectService) {}

  upsertSubject(params: { body: UpsertSubjectRequest; authenticatedUserId: string }) {
    void params.authenticatedUserId
    return this.subjectService.upsertSubject({
      subjectId: params.body.subjectId,
      name: params.body.name,
      medium: params.body.medium,
      isActive: params.body.isActive,
    })
  }
}
