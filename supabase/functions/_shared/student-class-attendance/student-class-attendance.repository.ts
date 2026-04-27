import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { StudentClassAttendanceModel } from "./student-class-attendance.model.ts"

export type StudentClassAttendanceRow = Database["public"]["Tables"]["student_class_attendances"]["Row"]

export interface StudentClassAttendanceRepository {
  update(attendance: StudentClassAttendanceModel): Promise<StudentClassAttendanceRow | null>
}

export class SupabaseStudentClassAttendanceRepository implements StudentClassAttendanceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async update(attendance: StudentClassAttendanceModel): Promise<StudentClassAttendanceRow | null> {
    const { data, error } = await this.supabase
      .from("student_class_attendances")
      .update({
        is_present: attendance.isPresent,
        is_active: attendance.isActive,
      })
      .eq("student_id", attendance.studentId)
      .eq("class_id", attendance.classId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
