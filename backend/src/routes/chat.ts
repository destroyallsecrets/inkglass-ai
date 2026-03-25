import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/chat', chatController.chat);
router.get('/sessions', chatController.getSessions);
router.get('/sessions/search', chatController.searchSessions);
router.get('/sessions/:id', chatController.getSession);
router.post('/sessions', chatController.createSession);
router.patch('/sessions/:id', chatController.updateSession);
router.delete('/sessions/:id', chatController.deleteSession);
router.post('/sessions/:id/messages', chatController.addMessage);
router.delete('/sessions/:id/messages/:messageId', chatController.deleteMessage);

export default router;
