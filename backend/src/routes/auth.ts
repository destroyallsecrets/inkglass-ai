import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);
router.patch('/me', authenticateToken, authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;
