import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// CRUD routes for categories - all protected
router.post('/', authenticateToken, categoryController.createCategory.bind(categoryController));
router.get('/', authenticateToken, categoryController.getAllCategories.bind(categoryController));
router.get('/:id', authenticateToken, categoryController.getCategoryById.bind(categoryController));
router.put('/:id', authenticateToken, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticateToken, categoryController.deleteCategory.bind(categoryController));

export default router;

