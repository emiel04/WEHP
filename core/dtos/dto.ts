import { Category, Streepje, User } from '@prisma/client';

export function toUserDTO(model: User): UserDTO | null {
  return { id: model.id, name: model.name, isWehp: model.isWehp } ?? null;
}

export function toStreepjeDTO(model: Streepje): StreepjeDTO {
  return { id: model.id, reason: model.reason, userId: model.userId, categoryId: model.categoryId, createdAt: model.createdAt, updatedAt: model.updatedAt};
}

export function toFullStreepjeDTO(model: FullStreepje): FullStreepjeDTO {
  return { id: model.id, reason: model.reason, userId: model.userId, categoryId: model.categoryId, category: toCategoryDTO(model.category), createdAt: model.createdAt, updatedAt: model.updatedAt};
}
export const toCategoryDTO = (category: any): CategoryDTO => {
  return {
    id: category.id,
    name: category.name,
  };
};

export type FullStreepje = Streepje & {
  category: Category
}

export type UserDTO = {
  id: number,
  name: string,
  isWehp: boolean
}

export type StreepjeDTO = {
  id: number,
  reason: string,
  userId: number,
  categoryId: number | null,
  createdAt: Date,
  updatedAt: Date
}

export type FullStreepjeDTO = StreepjeDTO & {
  category: CategoryDTO | null;
};

export type CategoryDTO = {
  id: number;
  name: string;
};
