import { Request, Response } from 'express';
import categoryService, { CreateCategoryDto, UpdateCategoryDto } from '../services.ts/categoryService';

export class CategoryController {
  // Create a new category
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateCategoryDto = {
        name: req.body.name,
      };

      // Validate required fields
      if (!categoryData.name || categoryData.name.trim() === '') {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      // Check if category already exists
      const existingCategory = await categoryService.getCategoryByName(categoryData.name);
      if (existingCategory) {
        res.status(409).json({ error: 'Category with this name already exists' });
        return;
      }

      const category = await categoryService.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      // Handle duplicate key error (if unique constraint fails)
      if (error.code === 11000) {
        res.status(409).json({ error: 'Category with this name already exists' });
        return;
      }
      res.status(500).json({ error: error.message || 'Failed to create category' });
    }
  }

  // Get all categories
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
  }

  // Get category by ID
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }
      const category = await categoryService.getCategoryById(id);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch category' });
    }
  }

  // Update category by ID
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }

      const updateData: UpdateCategoryDto = {};

      if (req.body.name) {
        if (req.body.name.trim() === '') {
          res.status(400).json({ error: 'Category name cannot be empty' });
          return;
        }
        updateData.name = req.body.name;
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      // If name is being updated, check if it's already taken
      if (updateData.name) {
        const existingCategory = await categoryService.getCategoryByName(updateData.name);
        if (existingCategory && existingCategory._id.toString() !== id) {
          res.status(409).json({ error: 'Category name already in use' });
          return;
        }
      }

      const category = await categoryService.updateCategory(id, updateData);

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(200).json(category);
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        res.status(409).json({ error: 'Category name already in use' });
        return;
      }
      res.status(500).json({ error: error.message || 'Failed to update category' });
    }
  }

  // Delete category by ID
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }
      const deleted = await categoryService.deleteCategory(id);

      if (!deleted) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete category' });
    }
  }
}

export default new CategoryController();

