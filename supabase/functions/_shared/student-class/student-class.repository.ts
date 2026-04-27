import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { StudentClassModel } from "./student-class.model.ts"

export type StudentClassRow = Database["public"]["Tables"]["student_classes"]["Row"]

export interface StudentClassRepository {
  create(studentClass: StudentClassModel): Promise<StudentClassRow>
  delete(params: { studentId: string; classId: string }): Promise<StudentClassRow | null>
}

export class SupabaseStudentClassRepository implements StudentClassRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(studentClass: StudentClassModel): Promise<StudentClassRow> {
    const payload: Database["public"]["Tables"]["student_classes"]["Insert"] = {
      student_id: studentClass.studentId,
      class_id: studentClass.classId,
      is_active: studentClass.isActive,
    }

    const { data, error } = await this.supabase
      .from("student_classes")
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Student or class not found", 400)
      }
      if (error.code === "23505") {
        throw new AppError("Student is already assigned to this class", 409)
      }
      throw new AppError(error.message, 400)
    }

    await this.seedAttendanceAndMonthlyPayment({
      studentId: studentClass.studentId,
      classId: studentClass.classId,
    })

    return data
  }

  private async seedAttendanceAndMonthlyPayment(params: {
    studentId: string
    classId: string
  }): Promise<void> {
    const attendancePayload: Database["public"]["Tables"]["student_class_attendances"]["Insert"] = {
      student_id: params.studentId,
      class_id: params.classId,
      attendance_date: Date.now(),
      is_present: false,
      is_active: true,
    }

    const { error: attendanceError } = await this.supabase
      .from("student_class_attendances")
      .insert(attendancePayload)

    if (attendanceError) {
      throw new AppError(attendanceError.message, 400)
    }

    const { data: classRow, error: classError } = await this.supabase
      .from("classes")
      .select("institute_id, grade, class_fee")
      .eq("id", params.classId)
      .maybeSingle()

    if (classError) {
      throw new AppError(classError.message, 400)
    }
    if (!classRow) {
      throw new AppError("Class not found", 404)
    }

    const paymentPayload: Database["public"]["Tables"]["student_class_monthly_payments"]["Insert"] = {
      billing_month: new Date().toISOString().slice(0, 10),
      student_id: params.studentId,
      grade: classRow.grade,
      class_id: params.classId,
      institute_id: classRow.institute_id,
      amount_due: classRow.class_fee,
      payment_amount: 0,
      payment_status: "PENDING",
      is_active: true,
    }

    const { error: paymentError } = await this.supabase
      .from("student_class_monthly_payments")
      .insert(paymentPayload)

    if (paymentError) {
      throw new AppError(paymentError.message, 400)
    }
  }

  async delete(params: { studentId: string; classId: string }): Promise<StudentClassRow | null> {
    const { data, error } = await this.supabase
      .from("student_classes")
      .delete()
      .eq("student_id", params.studentId)
      .eq("class_id", params.classId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }
}
