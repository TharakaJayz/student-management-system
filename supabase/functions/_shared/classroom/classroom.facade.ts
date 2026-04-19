import type { CreateClassRoomRequest, UpdateClassRoomRequest } from "./classroom.schema.ts"
import type { ClassRoomService } from "./classroom.service.ts"

export class ClassRoomFacade {
  constructor(private readonly classRoomService: ClassRoomService) {}

  createClassRoom(params: { body: CreateClassRoomRequest; authenticatedUserId: string }) {
    return this.classRoomService.createClassRoom({
      instituteId: params.body.instituteId,
      name: params.body.name,
      location: params.body.location,
      capacity: params.body.capacity,
      isAirConditioned: params.body.isAirConditioned,
      ownerId: params.authenticatedUserId,
    })
  }

  updateClassRoom(params: { body: UpdateClassRoomRequest; authenticatedUserId: string }) {
    return this.classRoomService.updateClassRoom({
      classRoomId: params.body.classRoomId,
      name: params.body.name,
      location: params.body.location,
      capacity: params.body.capacity,
      isAirConditioned: params.body.isAirConditioned,
      ownerId: params.authenticatedUserId,
    })
  }
}
