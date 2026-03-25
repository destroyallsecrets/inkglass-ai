import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/stats', analyticsController.getStats);
router.post('/usage', analyticsController.recordUsage);

export default router;
