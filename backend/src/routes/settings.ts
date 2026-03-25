import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/settings', settingsController.getSettings);
router.patch('/settings', settingsController.updateSettings);

router.get('/api-keys', settingsController.getApiKeys);
router.post('/api-keys', settingsController.createApiKey);
router.delete('/api-keys/:id', settingsController.deleteApiKey);

export default router;
