import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, transactionController.create.bind(transactionController));
router.get('/', authenticateToken, transactionController.list.bind(transactionController));

export default router;
