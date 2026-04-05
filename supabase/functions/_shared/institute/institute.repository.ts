import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { InstituteModel } from "./institute.model.ts"

export type InstituteRow = Database["public"]["Tables"]["institutes"]["Row"]

export interface InstituteRepository {
  create(institute: InstituteModel): Promise<InstituteRow>
}

export class SupabaseInstituteRepository implements InstituteRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(institute: InstituteModel): Promise<InstituteRow> {
    const insertPayload: Database["public"]["Tables"]["institutes"]["Insert"] = {
      name: institute.name,
      address: institute.address,
      owner_id: institute.ownerId,
    }

    const { data, error } = await this.supabase
      .from("institutes")
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
