import { Router } from 'express';
import { 
  getCmsContent, updateCmsContent,
  getFAQs, createFAQ, deleteFAQ,
  getSettings, updateSettings,
  getDashboardStats 
} from '../controllers/cmsController';
import { authenticateJWT, requireRole } from '../middlewares/auth';

const router = Router();

// Multilingual CMS Content (Vision, Mission, Values, Hero, Sections)
router.get('/content', getCmsContent);
router.put('/content', authenticateJWT, requireRole(['SuperAdmin', 'Editor']), updateCmsContent);

// FAQs
router.get('/faqs', getFAQs);
router.post('/faqs', authenticateJWT, requireRole(['SuperAdmin', 'Editor']), createFAQ);
router.delete('/faqs/:id', authenticateJWT, requireRole(['SuperAdmin', 'Editor']), deleteFAQ);

// Site Settings (WhatsApp, Contact Info, Social Links)
router.get('/settings', getSettings);
router.put('/settings', authenticateJWT, requireRole(['SuperAdmin', 'Editor']), updateSettings);

// Admin dashboard summary statistics (Database-driven live telemetry)
router.get('/stats', authenticateJWT, requireRole(['SuperAdmin', 'Editor', 'Viewer']), getDashboardStats);

export default router;
