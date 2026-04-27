import { AppError } from "../common/errors.ts"
import { StudentClassMonthlyPaymentModel } from "./student-class-monthly-payment.model.ts"
import type {
  StudentClassMonthlyPaymentRepository,
  StudentClassMonthlyPaymentRow,
} from "./student-class-monthly-payment.repository.ts"

export class StudentClassMonthlyPaymentService {
  constructor(private readonly paymentRepository: StudentClassMonthlyPaymentRepository) {}

  createStudentClassMonthlyPayment(params: {
    billingMonth: string
    studentId: string
    grade: string
    classId: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }): Promise<StudentClassMonthlyPaymentRow> {
    const payment = StudentClassMonthlyPaymentModel.create(params)
    return this.paymentRepository.create(payment)
  }

  async updateStudentClassMonthlyPayment(params: {
    billingMonth: string
    studentId: string
    grade: string
    classId: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }): Promise<StudentClassMonthlyPaymentRow> {
    const payment = StudentClassMonthlyPaymentModel.create(params)

    const updated = await this.paymentRepository.update({
      billingMonth: payment.billingMonth,
      studentId: payment.studentId,
      classId: payment.classId,
      grade: payment.grade,
      instituteId: payment.instituteId,
      amountDue: payment.amountDue,
      paymentAmount: payment.paymentAmount,
      paymentStatus: payment.paymentStatus,
      isActive: payment.isActive,
    })

    if (!updated) {
      throw new AppError("Student class monthly payment not found", 404)
    }

    return updated
  }

  async deleteStudentClassMonthlyPayment(params: {
    billingMonth: string
    studentId: string
    classId: string
  }): Promise<StudentClassMonthlyPaymentRow> {
    const deleted = await this.paymentRepository.delete(params)

    if (!deleted) {
      throw new AppError("Student class monthly payment not found", 404)
    }

    return deleted
  }
}
