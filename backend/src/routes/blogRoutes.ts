import { Router } from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { authenticateJWT, requireRole } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// Public routes
router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

// Protected routes (Admin / Editor)
router.post('/', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), upload.single('bannerImage'), createBlog);
router.put('/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), upload.single('bannerImage'), updateBlog);
router.delete('/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin']), deleteBlog);

export default router;
