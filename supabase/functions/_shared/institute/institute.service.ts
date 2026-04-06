import { AppError } from "../common/errors.ts"
import type { InstituteRepository, InstituteRow } from "./institute.repository.ts"
import { InstituteModel } from "./institute.model.ts"

export class InstituteService {
  constructor(private readonly instituteRepository: InstituteRepository) {}

  createInstitute(params: { name: string; address: string; ownerId: string }): Promise<InstituteRow> {
    const institute = InstituteModel.create(params)
    return this.instituteRepository.create(institute)
  }

  async updateInstitute(params: {
    instituteId: string
    ownerId: string
    name: string
    address: string
  }): Promise<InstituteRow> {
    const institute = InstituteModel.create({
      name: params.name,
      address: params.address,
      ownerId: params.ownerId,
    })

    const updated = await this.instituteRepository.update({
      instituteId: params.instituteId,
      ownerId: params.ownerId,
      name: institute.name,
      address: institute.address,
    })

    if (!updated) {
      throw new AppError("Institute not found", 404)
    }

    return updated
  }
}
