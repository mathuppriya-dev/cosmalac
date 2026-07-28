import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, createCategory } from '../controllers/productController';
import { authenticateJWT, requireRole } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getProduct);

// Protected routes (Admin / Editor)
router.post('/', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), upload.array('images', 5), createProduct);
router.post('/categories', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), createCategory);
router.put('/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin']), deleteProduct);

export default router;
