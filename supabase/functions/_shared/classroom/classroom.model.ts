import { AppError } from "../common/errors.ts"

export class ClassRoomModel {
  readonly name: string
  readonly instituteId: string
  readonly location: string
  readonly capacity: number
  readonly isAirConditioned: boolean

  private constructor(params: {
    name: string
    instituteId: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }) {
    this.name = params.name
    this.instituteId = params.instituteId
    this.location = params.location
    this.capacity = params.capacity
    this.isAirConditioned = params.isAirConditioned
  }

  static create(params: {
    name: string
    instituteId: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }) {
    if (!params.instituteId || params.instituteId.trim().length === 0) {
      throw new AppError("instituteId is required", 400)
    }

    const common = ClassRoomModel.parseMutableFields(params)

    return new ClassRoomModel({
      ...common,
      instituteId: params.instituteId.trim(),
    })
  }

  /** Validates name, location, capacity, and air-conditioning for update (no institute id). */
  static forMutableFields(params: {
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }) {
    return ClassRoomModel.parseMutableFields(params)
  }

  private static parseMutableFields(params: {
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
  }) {
    const normalizedName = params.name.trim()
    if (normalizedName.length < 1) {
      throw new AppError("Classroom name is required", 400)
    }
    if (normalizedName.length > 200) {
      throw new AppError("Classroom name must be at most 200 characters", 400)
    }

    const normalizedLocation = params.location.trim()
    if (normalizedLocation.length === 0) {
      throw new AppError("location is required", 400)
    }
    if (normalizedLocation.length > 500) {
      throw new AppError("location must be at most 500 characters", 400)
    }

    if (!Number.isInteger(params.capacity) || params.capacity < 0) {
      throw new AppError("capacity must be a non-negative integer", 400)
    }

    return {
      name: normalizedName,
      location: normalizedLocation,
      capacity: params.capacity,
      isAirConditioned: params.isAirConditioned,
    }
  }
}
