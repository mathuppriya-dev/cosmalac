import { Router } from 'express';
import { mediaController, uploadMiddleware } from '../controllers/mediaController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Public: View media files list
router.get('/', mediaController.getMedia);

// Admin Protected: Upload media (JPG/JPEG/PNG only, max 5MB)
router.post(
  '/upload',
  authenticateJWT,
  requireRole(['SuperAdmin', 'Editor']),
  uploadMiddleware.single('image'),
  mediaController.uploadImage
);

// Admin Protected: Delete media item
router.delete(
  '/:id',
  authenticateJWT,
  requireRole(['SuperAdmin', 'Editor']),
  mediaController.deleteMedia
);

export default router;
