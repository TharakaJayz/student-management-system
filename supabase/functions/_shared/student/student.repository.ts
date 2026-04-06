import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { StudentModel } from "./student.model.ts"

export type StudentRow = Database["public"]["Tables"]["students"]["Row"]

export interface StudentRepository {
  create(student: StudentModel): Promise<StudentRow>
  update(params: {
    studentId: string
    name: string
    age: number
    grade: string
    imageUrl: string
  }): Promise<StudentRow | null>
  findInstituteIdByOwnerId(ownerId: string): Promise<string | null>
  isStudentEnrolledInInstitute(params: { studentId: string; instituteId: string }): Promise<boolean>
  createStudentInstituteEnrollment(params: { studentId: string; instituteId: string }): Promise<void>
}

export class SupabaseStudentRepository implements StudentRepository {
  private readonly studentsTable = TABLES.STUDENTS
  private readonly institutesTable = TABLES.INSTITUTES

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(student: StudentModel): Promise<StudentRow> {
    const insertPayload: Database["public"]["Tables"]["students"]["Insert"] = {
      name: student.name,
      age: student.age,
      grade: student.grade,
      image_url: student.imageUrl,
    }

    const { data, error } = await this.supabase
      .from(this.studentsTable)
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async update(params: {
    studentId: string
    name: string
    age: number
    grade: string
    imageUrl: string
  }): Promise<StudentRow | null> {
    const { data, error } = await this.supabase
      .from(this.studentsTable)
      .update({
        name: params.name,
        age: params.age,
        grade: params.grade,
        image_url: params.imageUrl,
      })
      .eq("id", params.studentId)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data
  }

  async findInstituteIdByOwnerId(ownerId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from(this.institutesTable)
      .select("id")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return data?.id ?? null
  }

  async isStudentEnrolledInInstitute(params: { studentId: string; instituteId: string }): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("student_institute_enrollments")
      .select("student_id")
      .eq("student_id", params.studentId)
      .eq("institute_id", params.instituteId)
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return Boolean(data)
  }

  async createStudentInstituteEnrollment(params: { studentId: string; instituteId: string }): Promise<void> {
    const payload: Database["public"]["Tables"]["student_institute_enrollments"]["Insert"] = {
      student_id: params.studentId,
      institute_id: params.instituteId,
    }

    const { error } = await this.supabase.from("student_institute_enrollments").insert(payload)

    if (error) {
      throw new AppError(error.message, 400)
    }
  }
}
