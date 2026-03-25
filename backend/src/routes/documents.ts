import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', documentController.getDocuments);
router.get('/search', documentController.searchDocuments);
router.get('/:id', documentController.getDocument);
router.post('/', documentController.createDocument);
router.patch('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.get('/:id/download', documentController.downloadDocument);

export default router;
