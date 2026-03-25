import { Router } from 'express';
import { bookmarkController } from '../controllers/bookmarkController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', bookmarkController.getBookmarks);
router.post('/', bookmarkController.createBookmark);
router.delete('/:id', bookmarkController.deleteBookmark);

export default router;
