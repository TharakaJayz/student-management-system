import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import { TABLES } from "../common/const.ts";

export type OwnerRow = Database["public"]["Tables"]["owners"]["Row"]

export interface OwnerRepository {
  findById(id: string): Promise<OwnerRow | null>
  insert(row: { id: string; name: string; mobile: string }): Promise<OwnerRow>
  update(id: string, patch: { name: string; mobile: string }): Promise<OwnerRow>
}

export class SupabaseOwnerRepository implements OwnerRepository {
  private readonly table = TABLES.OWNERS 
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(id: string): Promise<OwnerRow | null> {
    const { data, error } = await this.supabase.from(this.table).select("*").eq("id", id).maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async insert(row: { id: string; name: string; mobile: string }): Promise<OwnerRow> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert({ id: row.id, name: row.name, mobile: row.mobile })
      .select("*")
      .single()

    if (error) {
      if (error.code === "23505") {
        throw new AppError("Mobile number is already registered", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(id: string, patch: { name: string; mobile: string }): Promise<OwnerRow> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({ name: patch.name, mobile: patch.mobile })
      .eq("id", id)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23505") {
        throw new AppError("Mobile number is already registered", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }
}
