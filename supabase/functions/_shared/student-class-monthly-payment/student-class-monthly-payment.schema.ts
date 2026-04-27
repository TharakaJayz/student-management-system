import { z } from "zod"

const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED"])

export const CreateStudentClassMonthlyPaymentRequestSchema = z.object({
  billingMonth: z.string().trim().min(1, "billingMonth is required").max(50, "billingMonth is too long"),
  studentId: z.string().uuid("studentId must be a valid UUID"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  classId: z.string().uuid("classId must be a valid UUID"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  amountDue: z.number().min(0, "amountDue must be non-negative"),
  paymentAmount: z.number().min(0, "paymentAmount must be non-negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean().optional().default(true),
})

export const DeleteStudentClassMonthlyPaymentRequestSchema = z.object({
  billingMonth: z.string().trim().min(1, "billingMonth is required").max(50, "billingMonth is too long"),
  studentId: z.string().uuid("studentId must be a valid UUID"),
  classId: z.string().uuid("classId must be a valid UUID"),
})

export const UpdateStudentClassMonthlyPaymentRequestSchema = z.object({
  billingMonth: z.string().trim().min(1, "billingMonth is required").max(50, "billingMonth is too long"),
  studentId: z.string().uuid("studentId must be a valid UUID"),
  classId: z.string().uuid("classId must be a valid UUID"),
  grade: z.string().trim().min(1, "grade is required").max(100, "grade is too long"),
  instituteId: z.string().uuid("instituteId must be a valid UUID"),
  amountDue: z.number().min(0, "amountDue must be non-negative"),
  paymentAmount: z.number().min(0, "paymentAmount must be non-negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean(),
})

export type CreateStudentClassMonthlyPaymentRequest = z.infer<typeof CreateStudentClassMonthlyPaymentRequestSchema>
export type DeleteStudentClassMonthlyPaymentRequest = z.infer<typeof DeleteStudentClassMonthlyPaymentRequestSchema>
export type UpdateStudentClassMonthlyPaymentRequest = z.infer<typeof UpdateStudentClassMonthlyPaymentRequestSchema>
