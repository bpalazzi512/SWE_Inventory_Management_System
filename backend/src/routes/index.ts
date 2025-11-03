import { Router } from 'express';
import userRoutes from './users';
import categoryRoutes from './categories';
import productRoutes from './products';
import transactionRoutes from './transactions';
import inventoryRoutes from './inventory';
import authRoutes from './auth';
// import postRoutes from './posts';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/auth', authRoutes);
// router.use('/posts', postRoutes);

export default router;