import type {
  CreateStudentClassMonthlyPaymentRequest,
  DeleteStudentClassMonthlyPaymentRequest,
  UpdateStudentClassMonthlyPaymentRequest,
} from "./student-class-monthly-payment.schema.ts"
import type { StudentClassMonthlyPaymentService } from "./student-class-monthly-payment.service.ts"

export class StudentClassMonthlyPaymentFacade {
  constructor(private readonly paymentService: StudentClassMonthlyPaymentService) {}

  createStudentClassMonthlyPayment(params: {
    body: CreateStudentClassMonthlyPaymentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.paymentService.createStudentClassMonthlyPayment({
      billingMonth: params.body.billingMonth,
      studentId: params.body.studentId,
      grade: params.body.grade,
      classId: params.body.classId,
      instituteId: params.body.instituteId,
      amountDue: params.body.amountDue,
      paymentAmount: params.body.paymentAmount,
      paymentStatus: params.body.paymentStatus,
      isActive: params.body.isActive,
    })
  }

  updateStudentClassMonthlyPayment(params: {
    body: UpdateStudentClassMonthlyPaymentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.paymentService.updateStudentClassMonthlyPayment({
      billingMonth: params.body.billingMonth,
      studentId: params.body.studentId,
      grade: params.body.grade,
      classId: params.body.classId,
      instituteId: params.body.instituteId,
      amountDue: params.body.amountDue,
      paymentAmount: params.body.paymentAmount,
      paymentStatus: params.body.paymentStatus,
      isActive: params.body.isActive,
    })
  }

  deleteStudentClassMonthlyPayment(params: {
    body: DeleteStudentClassMonthlyPaymentRequest
    authenticatedUserId: string
  }) {
    void params.authenticatedUserId
    return this.paymentService.deleteStudentClassMonthlyPayment({
      billingMonth: params.body.billingMonth,
      studentId: params.body.studentId,
      classId: params.body.classId,
    })
  }
}
