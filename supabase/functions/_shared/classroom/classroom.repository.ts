import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { TABLES } from "../common/const.ts"
import { AppError } from "../common/errors.ts"
import type { ClassRoomModel } from "./classroom.model.ts"

export type ClassRoomRow = Database["public"]["Tables"]["class_rooms"]["Row"]

export interface ClassRoomRepository {
  isInstituteOwnedBy(instituteId: string, ownerId: string): Promise<boolean>
  create(classRoom: ClassRoomModel): Promise<ClassRoomRow>
  updateForOwner(params: {
    classRoomId: string
    ownerId: string
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }): Promise<ClassRoomRow | null>
}

export class SupabaseClassRoomRepository implements ClassRoomRepository {
  private readonly table = TABLES.CLASS_ROOMS
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

  async create(classRoom: ClassRoomModel): Promise<ClassRoomRow> {
    const insertPayload: Database["public"]["Tables"]["class_rooms"]["Insert"] = {
      name: classRoom.name,
      institute_id: classRoom.instituteId,
      location: classRoom.location,
      capacity: classRoom.capacity,
      is_air_conditioned: classRoom.isAirConditioned,
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(insertPayload)
      .select("*")
      .single()

    if (error) {
      if (error.code === "23503") {
        throw new AppError("Institute does not exist", 400)
      }
      if (error.code === "23505") {
        throw new AppError("A classroom with this name already exists for this institute", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }

  async updateForOwner(params: {
    classRoomId: string
    ownerId: string
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }): Promise<ClassRoomRow | null> {
    const { data: row, error: loadError } = await this.supabase
      .from(this.table)
      .select("id, institute_id")
      .eq("id", params.classRoomId)
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
        location: params.location,
        capacity: params.capacity,
        is_air_conditioned: params.isAirConditioned,
      })
      .eq("id", params.classRoomId)
      .select("*")
      .maybeSingle()

    if (error) {
      if (error.code === "23505") {
        throw new AppError("A classroom with this name already exists for this institute", 400)
      }
      throw new AppError(error.message, 400)
    }

    return data
  }
}
