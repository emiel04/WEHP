import { User } from '@prisma/client';

export function toUserDTO(model: User): UserDTO | null {
  return { id: model.id, name: model.name, isWehp: model.isWehp } ?? null;
}

type UserDTO = {
  id: number,
  name: string,
  isWehp: boolean
}