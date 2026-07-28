import { Router } from 'express';
import { login, refreshToken, getMe } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import { validateBody, loginValidationSchema } from '../middlewares/validate';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Admin panel secure login
 *     description: Authenticates admin credentials and returns an access token along with a refresh token.
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@cosmalac.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: CosmalacPremium2026!
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', authLimiter, validateBody(loginValidationSchema), login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Rotate session token
 *     description: Exchange a valid refresh token for a new short-lived access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token successfully rotated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       403:
 *         description: Invalid refresh token
 */
router.post('/refresh', refreshToken);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Retrieve active user session profile
 *     description: Returns the user object derived from the valid Bearer token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User session details retrieved successfully.
 *       401:
 *         description: Unauthorized: Invalid token or missing header
 */
router.get('/me', authenticateJWT, getMe);

export default router;
