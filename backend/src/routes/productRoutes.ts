import { Router } from 'express';

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} from '../controllers/productController';

import {
  authenticateJWT,
  requireRole
} from '../middlewares/auth';

import { upload } from '../middlewares/upload';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getProduct);

// Protected routes
router.post(
  '/',
  authenticateJWT,
  requireRole(['SuperAdmin', 'Editor']),
  upload.array('images', 5),
  createProduct
);

router.post(
  '/categories',
  authenticateJWT,
  requireRole(['SuperAdmin', 'Editor']),
  createCategory
);

router.put(
  '/:id',
  authenticateJWT,
  requireRole(['SuperAdmin', 'Editor']),
  upload.array('images', 5),
  updateProduct
);

// Only SuperAdmin can delete products
router.delete(
  '/:id',
  authenticateJWT,
  requireRole(['SuperAdmin']),
  deleteProduct
);

export default router;