import { Streepje, User } from '@prisma/client';

export function toUserDTO(model: User): UserDTO | null {
  return { id: model.id, name: model.name, isWehp: model.isWehp } ?? null;
}

export function toStreepjeDTO(model: Streepje): StreepjeDTO {
  return { id: model.id, reason: model.reason, userId: model.userId };
}

export type UserDTO = {
  id: number,
  name: string,
  isWehp: boolean
}

export type StreepjeDTO = {
  id: number,
  reason: string,
  userId: number
}