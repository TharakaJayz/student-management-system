import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { TeacherInstituteAssignmentModel } from "./teacher-institute-assignment.model.ts"

export type TeacherInstituteAssignmentRow = Database["public"]["Tables"]["teacher_institute_assignments"]["Row"]

export interface TeacherInstituteAssignmentRepository {
  create(assignment: TeacherInstituteAssignmentModel): Promise<TeacherInstituteAssignmentRow>
  update(params: {
    teacherId: string
    instituteId: string
    isActive: boolean
  }): Promise<TeacherInstituteAssignmentRow | null>
  delete(params: { teacherId: string; instituteId: string }): Promise<TeacherInstituteAssignmentRow | null>
}

export class SupabaseTeacherInstituteAssignmentRepository implements TeacherInstituteAssignmentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(assignment: TeacherInstituteAssignmentModel): Promise<TeacherInstituteAssignmentRow> {
    const payload: Database["public"]["Tables"]["teacher_institute_assignments"]["Insert"] = {
      teacher_id: assignment.teacherId,
      institute_id: assignment.instituteId,
      is_active: assignment.isActive,
    }

    const { data, error } = await this.supabase
      .from("teacher_institute_assignments")
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Teacher or institute not found", 400)
      }
      if (error.code === "23505") {
        throw new AppError("Teacher is already assigned to this institute", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    teacherId: string
    instituteId: string
    isActive: boolean
  }): Promise<TeacherInstituteAssignmentRow | null> {
    const { data, error } = await this.supabase
      .from("teacher_institute_assignments")
      .update({ is_active: params.isActive })
      .eq("teacher_id", params.teacherId)
      .eq("institute_id", params.instituteId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async delete(params: { teacherId: string; instituteId: string }): Promise<TeacherInstituteAssignmentRow | null> {
    const { data, error } = await this.supabase
      .from("teacher_institute_assignments")
      .delete()
      .eq("teacher_id", params.teacherId)
      .eq("institute_id", params.instituteId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
