import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { InstituteModel } from "./institute.model.ts"

export type InstituteRow = Database["public"]["Tables"]["institutes"]["Row"]

export interface InstituteRepository {
  create(institute: InstituteModel): Promise<InstituteRow>
  update(params: {
    instituteId: string
    ownerId: string
    name: string
    address: string
  }): Promise<InstituteRow | null>
  findInstituteIdByOwnerId(ownerId: string): Promise<string | null>
}

export class SupabaseInstituteRepository implements InstituteRepository {
  private readonly table = TABLES.INSTITUTES

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(institute: InstituteModel): Promise<InstituteRow> {
    const insertPayload: Database["public"]["Tables"]["institutes"]["Insert"] = {
      name: institute.name,
      address: institute.address,
      owner_id: institute.ownerId,
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError(
          "Owner profile must exist before creating an institute",
          400,
        )
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    instituteId: string
    ownerId: string
    name: string
    address: string
  }): Promise<InstituteRow | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({ name: params.name, address: params.address })
      .eq("id", params.instituteId)
      .eq("owner_id", params.ownerId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async findInstituteIdByOwnerId(ownerId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("id")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data?.id ?? null
  }
}
