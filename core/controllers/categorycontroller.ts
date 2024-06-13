import { prisma } from '../../prisma'; // Import Prisma instance and models
import { BodyParsingError, StateError } from '../errors/WEHPError';
import { CategoryDTO, toCategoryDTO } from '../dtos/dto'; // Define CategoryDTO as needed

export type TCategoryCreate = {
  name: string;
}

export type TCategoryUpdate = {
  name?: string;
}

class CategoryController {
  createCategory = async (categoryCreate: TCategoryCreate): Promise<CategoryDTO> => {
    const { name } = categoryCreate;

    if (!name) {
      throw new BodyParsingError('Category name is required');
    }

    // Create Category record
    const createdCategory = await prisma.category.create({
      data: { name },
    });

    return toCategoryDTO(createdCategory);
  }

  getCategoryById = async (categoryId: number): Promise<CategoryDTO> => {
    if (!categoryId) {
      throw new BodyParsingError('Category ID is required');
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new StateError('Category not found');
    }

    return toCategoryDTO(category);
  }

  getAllCategories = async (): Promise<CategoryDTO[]> => {
    const categories = await prisma.category.findMany();
    return categories.map(toCategoryDTO);
  }

  updateCategory = async (categoryId: number, categoryUpdate: TCategoryUpdate): Promise<CategoryDTO> => {
    const { name } = categoryUpdate;

    const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      throw new StateError('Category not found');
    }

    // Update Category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name: name ?? undefined },
    });

    return toCategoryDTO(updatedCategory);
  }

  deleteCategory = async (categoryId: number) => {
    if (!categoryId) {
      throw new BodyParsingError('Category ID is required');
    }

    const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existingCategory) {
      throw new StateError('Category not found');
    }

    // Delete Category
    await prisma.category.delete({ where: { id: categoryId } });
    return toCategoryDTO(existingCategory);
  }
}

const categoryController = new CategoryController();

export { categoryController };