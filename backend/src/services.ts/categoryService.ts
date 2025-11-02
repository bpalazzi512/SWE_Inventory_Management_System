import Category, { ICategory } from '../models/Category';
import { Types } from 'mongoose';

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

export class CategoryService {
  // Create a new category
  async createCategory(categoryData: CreateCategoryDto): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  // Get all categories
  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find();
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Category.findById(id);
  }

  // Get category by name
  async getCategoryByName(name: string): Promise<ICategory | null> {
    return await Category.findOne({ name: name.trim() });
  }

  // Update category by ID
  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );
    return category;
  }

  // Delete category by ID
  async deleteCategory(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Category.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new CategoryService();

