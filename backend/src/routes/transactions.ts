import { Router } from 'express';
import transactionController from '../controllers/transactionController';

const router = Router();

router.post('/', transactionController.create.bind(transactionController));
router.get('/', transactionController.list.bind(transactionController));

export default router;
