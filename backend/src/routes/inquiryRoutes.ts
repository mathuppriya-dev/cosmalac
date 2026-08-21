import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiry } from '../controllers/inquiryController';
import { authenticateJWT, requireRole } from '../middlewares/auth';
import { inquiryLimiter } from '../middlewares/rateLimiter';
import { validateBody, inquiryValidationSchema } from '../middlewares/validate';

const router = Router();

// Public submission
router.post('/', inquiryLimiter, validateBody(inquiryValidationSchema), submitInquiry);

// Protected admin controls
router.get(
    '/',
    authenticateJWT,
    requireRole(['SuperAdmin', 'Editor', 'Viewer']),
    getInquiries
);

router.put(
    '/:id',
    authenticateJWT,
    requireRole(['SuperAdmin', 'Editor']),
    updateInquiry
);
export default router;
