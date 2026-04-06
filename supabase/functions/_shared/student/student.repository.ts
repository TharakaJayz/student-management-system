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
}

export class SupabaseStudentRepository implements StudentRepository {
  private readonly table = TABLES.STUDENTS

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(student: StudentModel): Promise<StudentRow> {
    const insertPayload: Database["public"]["Tables"]["students"]["Insert"] = {
      name: student.name,
      age: student.age,
      grade: student.grade,
      image_url: student.imageUrl,
    }

    const { data, error } = await this.supabase
      .from(this.table)
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
      .from(this.table)
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
}
