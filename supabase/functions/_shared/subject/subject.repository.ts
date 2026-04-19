import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { SubjectModel } from "./subject.model.ts"

export type SubjectRow = Database["public"]["Tables"]["subjects"]["Row"]

export interface SubjectRepository {
  create(subject: SubjectModel): Promise<SubjectRow>
  update(params: {
    subjectId: string
    name: string
    medium: "ENGLISH" | "SINHALA"
    isActive: boolean
  }): Promise<SubjectRow | null>
}

export class SupabaseSubjectRepository implements SubjectRepository {
  private readonly table = TABLES.SUBJECTS

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(subject: SubjectModel): Promise<SubjectRow> {
    const insertPayload: Database["public"]["Tables"]["subjects"]["Insert"] = {
      name: subject.name,
      medium: subject.medium,
      is_active: subject.isActive,
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23505") {
        throw new AppError("A subject with this name and medium already exists", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    subjectId: string
    name: string
    medium: "ENGLISH" | "SINHALA"
    isActive: boolean
  }): Promise<SubjectRow | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({
        name: params.name,
        medium: params.medium,
        is_active: params.isActive,
      })
      .eq("id", params.subjectId)
      .select("*")
      .maybeSingle()

    if (error) {
      if (error.code === "23505") {
        throw new AppError("A subject with this name and medium already exists", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }
}
