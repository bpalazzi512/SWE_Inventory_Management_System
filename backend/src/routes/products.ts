import { Router } from 'express';
import productController from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// CRUD routes for products - all protected
router.post('/', authenticateToken, productController.createProduct.bind(productController));
router.get('/', authenticateToken, productController.getAllProducts.bind(productController));
router.get('/:id', authenticateToken, productController.getProductById.bind(productController));
router.put('/:id', authenticateToken, productController.updateProduct.bind(productController));
router.delete('/:id', authenticateToken, productController.deleteProduct.bind(productController));

export default router;

