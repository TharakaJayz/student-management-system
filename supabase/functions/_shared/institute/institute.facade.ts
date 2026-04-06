import type {
  CreateInstituteRequest,
  UpdateInstituteRequest,
} from "./institute.schema.ts"
import type { InstituteService } from "./institute.service.ts"

export class InstituteFacade {
  constructor(private readonly instituteService: InstituteService) {}

  createInstitute(params: { body: CreateInstituteRequest; authenticatedUserId: string }) {
    return this.instituteService.createInstitute({
      name: params.body.name,
      address: params.body.address,
      ownerId: params.authenticatedUserId,
    })
  }

  updateInstitute(params: { body: UpdateInstituteRequest; authenticatedUserId: string }) {
    return this.instituteService.updateInstitute({
      instituteId: params.body.instituteId,
      name: params.body.name,
      address: params.body.address,
      ownerId: params.authenticatedUserId,
    })
  }
}
