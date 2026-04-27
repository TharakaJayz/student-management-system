import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { StudentInstituteEnrollmentModel } from "./student-institute-enrollment.model.ts"

export type StudentInstituteEnrollmentRow = Database["public"]["Tables"]["student_institute_enrollments"]["Row"]

export interface StudentInstituteEnrollmentRepository {
  create(enrollment: StudentInstituteEnrollmentModel): Promise<StudentInstituteEnrollmentRow>
  delete(params: { studentId: string; instituteId: string }): Promise<StudentInstituteEnrollmentRow | null>
}

export class SupabaseStudentInstituteEnrollmentRepository implements StudentInstituteEnrollmentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(enrollment: StudentInstituteEnrollmentModel): Promise<StudentInstituteEnrollmentRow> {
    const payload: Database["public"]["Tables"]["student_institute_enrollments"]["Insert"] = {
      student_id: enrollment.studentId,
      institute_id: enrollment.instituteId,
      is_active: enrollment.isActive,
    }

    const { data, error } = await this.supabase
      .from("student_institute_enrollments")
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Student or institute not found", 400)
      }
      if (error.code === "23505") {
        throw new AppError("Student is already enrolled in this institute", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async delete(params: { studentId: string; instituteId: string }): Promise<StudentInstituteEnrollmentRow | null> {
    const { data, error } = await this.supabase
      .from("student_institute_enrollments")
      .delete()
      .eq("student_id", params.studentId)
      .eq("institute_id", params.instituteId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
