import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "../common/errors.ts"
import type { StudentClassMonthlyPaymentModel } from "./student-class-monthly-payment.model.ts"

export type StudentClassMonthlyPaymentRow = Database["public"]["Tables"]["student_class_monthly_payments"]["Row"]

export interface StudentClassMonthlyPaymentRepository {
  create(payment: StudentClassMonthlyPaymentModel): Promise<StudentClassMonthlyPaymentRow>
  update(params: {
    billingMonth: string
    studentId: string
    classId: string
    grade: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }): Promise<StudentClassMonthlyPaymentRow | null>
  delete(params: {
    billingMonth: string
    studentId: string
    classId: string
  }): Promise<StudentClassMonthlyPaymentRow | null>
}

export class SupabaseStudentClassMonthlyPaymentRepository implements StudentClassMonthlyPaymentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(payment: StudentClassMonthlyPaymentModel): Promise<StudentClassMonthlyPaymentRow> {
    const payload: Database["public"]["Tables"]["student_class_monthly_payments"]["Insert"] = {
      billing_month: payment.billingMonth,
      student_id: payment.studentId,
      grade: payment.grade,
      class_id: payment.classId,
      institute_id: payment.instituteId,
      amount_due: payment.amountDue,
      payment_amount: payment.paymentAmount,
      payment_status: payment.paymentStatus,
      is_active: payment.isActive,
    }

    const { data, error } = await this.supabase
      .from("student_class_monthly_payments")
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Student, class, or institute not found", 400)
      }
      if (error.code === "23505") {
        throw new AppError("Monthly payment already exists for this billingMonth/student/class", 409)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async delete(params: {
    billingMonth: string
    studentId: string
    classId: string
  }): Promise<StudentClassMonthlyPaymentRow | null> {
    const { data, error } = await this.supabase
      .from("student_class_monthly_payments")
      .delete()
      .eq("billing_month", params.billingMonth)
      .eq("student_id", params.studentId)
      .eq("class_id", params.classId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    billingMonth: string
    studentId: string
    classId: string
    grade: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }): Promise<StudentClassMonthlyPaymentRow | null> {
    const { data, error } = await this.supabase
      .from("student_class_monthly_payments")
      .update({
        grade: params.grade,
        institute_id: params.instituteId,
        amount_due: params.amountDue,
        payment_amount: params.paymentAmount,
        payment_status: params.paymentStatus,
        is_active: params.isActive,
      })
      .eq("billing_month", params.billingMonth)
      .eq("student_id", params.studentId)
      .eq("class_id", params.classId)
      .select("*")
      .maybeSingle()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Student, class, or institute not found", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }
}
