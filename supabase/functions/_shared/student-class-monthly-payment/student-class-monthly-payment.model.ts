import { AppError } from "../common/errors.ts"

export class StudentClassMonthlyPaymentModel {
  readonly billingMonth: string
  readonly studentId: string
  readonly grade: string
  readonly classId: string
  readonly instituteId: string
  readonly amountDue: number
  readonly paymentAmount: number
  readonly paymentStatus: "PENDING" | "PAID" | "FAILED"
  readonly isActive: boolean

  private constructor(params: {
    billingMonth: string
    studentId: string
    grade: string
    classId: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }) {
    this.billingMonth = params.billingMonth
    this.studentId = params.studentId
    this.grade = params.grade
    this.classId = params.classId
    this.instituteId = params.instituteId
    this.amountDue = params.amountDue
    this.paymentAmount = params.paymentAmount
    this.paymentStatus = params.paymentStatus
    this.isActive = params.isActive
  }

  static create(params: {
    billingMonth: string
    studentId: string
    grade: string
    classId: string
    instituteId: string
    amountDue: number
    paymentAmount: number
    paymentStatus: "PENDING" | "PAID" | "FAILED"
    isActive: boolean
  }) {
    const billingMonth = params.billingMonth.trim()
    if (billingMonth.length === 0) {
      throw new AppError("billingMonth is required", 400)
    }

    const grade = params.grade.trim()
    if (grade.length === 0) {
      throw new AppError("grade is required", 400)
    }

    if (params.amountDue < 0) {
      throw new AppError("amountDue must be non-negative", 400)
    }
    if (params.paymentAmount < 0) {
      throw new AppError("paymentAmount must be non-negative", 400)
    }

    return new StudentClassMonthlyPaymentModel({
      billingMonth,
      studentId: params.studentId.trim(),
      grade,
      classId: params.classId.trim(),
      instituteId: params.instituteId.trim(),
      amountDue: params.amountDue,
      paymentAmount: params.paymentAmount,
      paymentStatus: params.paymentStatus,
      isActive: params.isActive,
    })
  }
}
