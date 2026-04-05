import type { InstituteRepository, InstituteRow } from "./institute.repository.ts"
import { InstituteModel } from "./institute.model.ts"

export class InstituteService {
  constructor(private readonly instituteRepository: InstituteRepository) {}

  createInstitute(params: { name: string; address: string; ownerId: string }): Promise<InstituteRow> {
    const institute = InstituteModel.create(params)
    return this.instituteRepository.create(institute)
  }
}
