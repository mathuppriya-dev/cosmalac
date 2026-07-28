import { Router } from 'express';
import { 
  getTestimonials, createTestimonial, deleteTestimonial,
  getFAQs, createFAQ, deleteFAQ,
  getSettings, updateSettings,
  getDashboardStats 
} from '../controllers/cmsController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Testimonials (Public & Protected)
router.get('/testimonials', getTestimonials);
router.post('/testimonials', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), createTestimonial);
router.delete('/testimonials/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin']), deleteTestimonial);

// FAQs (Public & Protected)
router.get('/faqs', getFAQs);
router.post('/faqs', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor']), createFAQ);
router.delete('/faqs/:id', authenticateJWT, requireRole(['SuperAdmin', 'Admin']), deleteFAQ);

// Site Settings
router.get('/settings', getSettings);
router.put('/settings', authenticateJWT, requireRole(['SuperAdmin', 'Admin']), updateSettings);

// Admin dashboard summary statistics
router.get('/stats', authenticateJWT, requireRole(['SuperAdmin', 'Admin', 'Editor', 'Viewer']), getDashboardStats);

export default router;
