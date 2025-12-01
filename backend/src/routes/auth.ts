import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateApiKey } from '../middleware/apiKey';

const router = Router();

// Public auth endpoints protected by API key
router.post('/login', validateApiKey, authController.login.bind(authController));
router.post('/register', validateApiKey, authController.register.bind(authController));

// Authenticated user info
router.get('/me', authenticateToken, authController.me.bind(authController));

export default router;
