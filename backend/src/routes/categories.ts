import { Router } from 'express';
import categoryController from '../controllers/categoryController';

const router = Router();

// CRUD routes for categories
router.post('/', categoryController.createCategory.bind(categoryController));
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;

