import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { TeacherModel } from "./teacher.model.ts"

export type TeacherRow = Database["public"]["Tables"]["teachers"]["Row"]

export interface TeacherRepository {
  create(teacher: TeacherModel): Promise<TeacherRow>
  update(params: {
    teacherId: string
    name: string
    mobile: string
    subjectId: string
  }): Promise<TeacherRow | null>
  isTeacherAssignedToInstitute(params: { teacherId: string; instituteId: string }): Promise<boolean>
  createTeacherInstituteAssignment(params: { teacherId: string; instituteId: string }): Promise<void>
}

export class SupabaseTeacherRepository implements TeacherRepository {
  private readonly table = TABLES.TEACHERS

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(teacher: TeacherModel): Promise<TeacherRow> {
    const insertPayload: Database["public"]["Tables"]["teachers"]["Insert"] = {
      name: teacher.name,
      mobile: teacher.mobile,
      subject_id: teacher.subjectId,
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Subject not found", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    teacherId: string
    name: string
    mobile: string
    subjectId: string
  }): Promise<TeacherRow | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({
        name: params.name,
        mobile: params.mobile,
        subject_id: params.subjectId,
      })
      .eq("id", params.teacherId)
      .select("*")
      .maybeSingle()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Subject not found", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async isTeacherAssignedToInstitute(params: { teacherId: string; instituteId: string }): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("teacher_institute_assignments")
      .select("teacher_id")
      .eq("teacher_id", params.teacherId)
      .eq("institute_id", params.instituteId)
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return Boolean(data)
  }

  async createTeacherInstituteAssignment(params: { teacherId: string; instituteId: string }): Promise<void> {
    const payload: Database["public"]["Tables"]["teacher_institute_assignments"]["Insert"] = {
      teacher_id: params.teacherId,
      institute_id: params.instituteId,
    }

    const { error } = await this.supabase.from("teacher_institute_assignments").insert(payload)

    if (error) {
      throw new AppError(error.message, 400)
    }
  }
}
