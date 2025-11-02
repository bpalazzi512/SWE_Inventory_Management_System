import { Router } from 'express';
import userRoutes from './users';
import categoryRoutes from './categories';
import productRoutes from './products';
// import postRoutes from './posts';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
// router.use('/posts', postRoutes);

export default router;