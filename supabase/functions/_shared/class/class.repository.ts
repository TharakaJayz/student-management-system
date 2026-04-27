import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { ClassModel } from "./class.model.ts"

export type ClassRow = Database["public"]["Tables"]["classes"]["Row"]

export interface ClassRepository {
  isInstituteOwnedBy(instituteId: string, ownerId: string): Promise<boolean>
  create(cls: ClassModel): Promise<ClassRow>
  updateForOwner(params: {
    classId: string
    ownerId: string
    name: string
    classRoomId: string
    teacherId: string
    subjectId: string
    grade: string
    startTime: number
    endTime: number
    frequency: "WEEKLY" | "OTHER"
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    classFee: number
  }): Promise<ClassRow | null>
}

export class SupabaseClassRepository implements ClassRepository {
  private readonly table = TABLES.CLASSES
  private readonly institutesTable = TABLES.INSTITUTES

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async isInstituteOwnedBy(instituteId: string, ownerId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.institutesTable)
      .select("id")
      .eq("id", instituteId)
      .eq("owner_id", ownerId)
      .maybeSingle()

    if (error) {
      throw new AppError(error.message, 400)
    }

    return Boolean(data)
  }

  async create(cls: ClassModel): Promise<ClassRow> {
    const payload: Database["public"]["Tables"]["classes"]["Insert"] = {
      name: cls.name,
      class_room_id: cls.classRoomId,
      institute_id: cls.instituteId,
      teacher_id: cls.teacherId,
      subject_id: cls.subjectId,
      grade: cls.grade,
      start_time: cls.startTime,
      end_time: cls.endTime,
      frequency: cls.frequency,
      day: cls.day,
      class_fee: cls.classFee,
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Related classroom, institute, teacher, or subject not found", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async updateForOwner(params: {
    classId: string
    ownerId: string
    name: string
    classRoomId: string
    teacherId: string
    subjectId: string
    grade: string
    startTime: number
    endTime: number
    frequency: "WEEKLY" | "OTHER"
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
    classFee: number
  }): Promise<ClassRow | null> {
    const { data: row, error: loadError } = await this.supabase
      .from(this.table)
      .select("id, institute_id")
      .eq("id", params.classId)
      .maybeSingle()

    if (loadError) {
      throw new AppError(loadError.message, 400)
    }

    if (!row) {
      return null
    }

    const owned = await this.isInstituteOwnedBy(row.institute_id, params.ownerId)
    if (!owned) {
      return null
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .update({
        name: params.name,
        class_room_id: params.classRoomId,
        teacher_id: params.teacherId,
        subject_id: params.subjectId,
        grade: params.grade,
        start_time: params.startTime,
        end_time: params.endTime,
        frequency: params.frequency,
        day: params.day,
        class_fee: params.classFee,
      })
      .eq("id", params.classId)
      .select("*")
      .maybeSingle()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Related classroom, teacher, or subject not found", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }
}
