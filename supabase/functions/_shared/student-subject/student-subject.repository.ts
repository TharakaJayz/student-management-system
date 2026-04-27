import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { StudentSubjectModel } from "./student-subject.model.ts"

export type StudentSubjectRow = Database["public"]["Tables"]["student_subjects"]["Row"]

export interface StudentSubjectRepository {
  create(studentSubject: StudentSubjectModel): Promise<StudentSubjectRow>
  delete(params: { studentId: string; subjectId: string }): Promise<StudentSubjectRow | null>
}

export class SupabaseStudentSubjectRepository implements StudentSubjectRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(studentSubject: StudentSubjectModel): Promise<StudentSubjectRow> {
    const payload: Database["public"]["Tables"]["student_subjects"]["Insert"] = {
      student_id: studentSubject.studentId,
      subject_id: studentSubject.subjectId,
      is_active: studentSubject.isActive,
    }

    const { data, error } = await this.supabase
      .from("student_subjects")
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Student or subject not found", 400)
      }
      if (error.code === "23505") {
        throw new AppError("Student is already assigned to this subject", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async delete(params: { studentId: string; subjectId: string }): Promise<StudentSubjectRow | null> {
    const { data, error } = await this.supabase
      .from("student_subjects")
      .delete()
      .eq("student_id", params.studentId)
      .eq("subject_id", params.subjectId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
