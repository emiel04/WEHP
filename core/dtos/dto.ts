import { Streepje, User } from '@prisma/client';

export function toUserDTO(model: User): UserDTO | null {
  return { id: model.id, name: model.name, isWehp: model.isWehp } ?? null;
}

export function toStreepjeDTO(model: Streepje): StreepjeDTO {
  return { id: model.id, reason: model.reason, userId: model.userId, categoryId: model.categoryId };
}

export const toCategoryDTO = (category: any): CategoryDTO => {
  return {
    id: category.id,
    name: category.name,
  };
};

export type UserDTO = {
  id: number,
  name: string,
  isWehp: boolean
}

export type StreepjeDTO = {
  id: number,
  reason: string,
  userId: number,
  categoryId: number | null
}
export type CategoryDTO = {
  id: number;
  name: string;
};
