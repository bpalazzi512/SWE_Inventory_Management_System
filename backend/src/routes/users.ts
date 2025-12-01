import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// CRUD routes for users - all protected
router.post('/', authenticateToken, userController.createUser.bind(userController));
router.get('/', authenticateToken, userController.getAllUsers.bind(userController));
router.get('/:id', authenticateToken, userController.getUserById.bind(userController));
router.put('/:id', authenticateToken, userController.updateUser.bind(userController));
router.delete('/:id', authenticateToken, userController.deleteUser.bind(userController));

export default router;

