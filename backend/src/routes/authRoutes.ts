import { Router } from 'express';
import { login, refreshToken, getMe, requestOtp, verifyOtp } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @openapi
 * /api/auth/request-otp:
 *   post:
 *     summary: Request OTP access code for admin login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@cosmalac.com
 *     responses:
 *       200:
 *         description: OTP successfully generated and sent to email
 */
router.post('/request-otp', authLimiter, requestOtp);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify 6-digit OTP code and receive session token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@cosmalac.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified. Returns JWT session tokens.
 */
router.post('/verify-otp', authLimiter, verifyOtp);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Password fallback login
 *     tags:
 *       - Authentication
 */
router.post('/login', authLimiter, login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 */
router.post('/refresh', refreshToken);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated admin profile
 *     tags:
 *       - Authentication
 */
router.get('/me', authenticateJWT, getMe);

export default router;
