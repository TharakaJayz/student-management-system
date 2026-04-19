import { AppError } from "../common/errors.ts"
import type { ClassRoomRepository, ClassRoomRow } from "./classroom.repository.ts"
import { ClassRoomModel } from "./classroom.model.ts"

export class ClassRoomService {
  constructor(private readonly classRoomRepository: ClassRoomRepository) {}

  async createClassRoom(params: {
    instituteId: string
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
    ownerId: string
  }): Promise<ClassRoomRow> {
    const owned = await this.classRoomRepository.isInstituteOwnedBy(params.instituteId, params.ownerId)
    if (!owned) {
      throw new AppError("Institute not found", 404)
    }

    const classRoom = ClassRoomModel.create({
      name: params.name,
      instituteId: params.instituteId,
      location: params.location,
      capacity: params.capacity,
      isAirConditioned: params.isAirConditioned,
    })

    return this.classRoomRepository.create(classRoom)
  }

  async updateClassRoom(params: {
    classRoomId: string
    name: string
    location: string
    capacity: number
    isAirConditioned: boolean
    ownerId: string
  }): Promise<ClassRoomRow> {
    const fields = ClassRoomModel.forMutableFields({
      name: params.name,
      location: params.location,
      capacity: params.capacity,
      isAirConditioned: params.isAirConditioned,
    })

    const updated = await this.classRoomRepository.updateForOwner({
      classRoomId: params.classRoomId,
      ownerId: params.ownerId,
      ...fields,
    })

    if (!updated) {
      throw new AppError("Classroom not found", 404)
    }

    return updated
  }
}
