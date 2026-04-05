import { AppError } from "../common/errors.ts"
import { CreateInstituteRequestSchema } from "./institute.schema.ts"
import type { InstituteService } from "./institute.service.ts"

export class InstituteFacade {
  constructor(private readonly instituteService: InstituteService) {}

  createInstitute(params: { body: unknown; authenticatedUserId: string }) {
    const parsedBody = CreateInstituteRequestSchema.safeParse(params.body)
    if (!parsedBody.success) {
      throw new AppError("Validation failed", 400, parsedBody.error.flatten())
    }

    return this.instituteService.createInstitute({
      name: parsedBody.data.name,
      address: parsedBody.data.address,
      ownerId: parsedBody.data.ownerId,
    })
  }
}
