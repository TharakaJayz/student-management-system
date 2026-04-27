import type { ClassService } from "./class.service.ts"
import type { CreateClassRequest, UpdateClassRequest } from "./class.schema.ts"

export class ClassFacade {
  constructor(private readonly classService: ClassService) {}

  createClass(params: { body: CreateClassRequest; authenticatedUserId: string }) {
    return this.classService.createClass({
      ownerId: params.authenticatedUserId,
      name: params.body.name,
      classRoomId: params.body.classRoomId,
      teacherId: params.body.teacherId,
      subjectId: params.body.subjectId,
      grade: params.body.grade,
      startTime: params.body.startTime,
      endTime: params.body.endTime,
      frequency: params.body.frequency,
      day: params.body.day,
      classFee: params.body.classFee,
    })
  }

  updateClass(params: { body: UpdateClassRequest; authenticatedUserId: string }) {
    return this.classService.updateClass({
      classId: params.body.classId,
      ownerId: params.authenticatedUserId,
      name: params.body.name,
      classRoomId: params.body.classRoomId,
      teacherId: params.body.teacherId,
      subjectId: params.body.subjectId,
      grade: params.body.grade,
      startTime: params.body.startTime,
      endTime: params.body.endTime,
      frequency: params.body.frequency,
      day: params.body.day,
      classFee: params.body.classFee,
    })
  }
}
