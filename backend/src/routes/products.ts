import { Router } from 'express';
import productController from '../controllers/productController';

const router = Router();

// CRUD routes for products
router.post('/', productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

export default router;

