import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService';
import { sendOtpEmail } from '../services/emailService';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'cosmalac_super_secret_key_2026!';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'cosmalac_refresh_secret_key_2026!';

// In-memory / persistent OTP cache (email -> { otpHash, expiresAt, attempts, role })
interface OtpEntry {
  otpHash: string;
  expiresAt: number;
  attempts: number;
  role: string;
}

const otpChallenges = new Map<string, OtpEntry>();

/**
 * Request OTP verification code to admin email
 */
export const requestOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await dbService.findUserByEmail(normalizedEmail);

    // In development or if user exists, determine role
    const userRole = user ? user.role : (normalizedEmail.includes('admin') ? 'SuperAdmin' : 'Editor');

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // 10 minutes expiry
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpChallenges.set(normalizedEmail, {
      otpHash,
      expiresAt,
      attempts: 0,
      role: userRole
    });

    logger.info(`\n🔑 [COSMALAC AUTH] Generated OTP for ${normalizedEmail}: ${otp} (Expires in 10m)\n`);

    // Dispatch email via Resend or Mock logger
    await sendOtpEmail(normalizedEmail, otp);

    res.json({
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      expiresIn: 600
    });
  } catch (error: any) {
    logger.error(`Error generating OTP for ${normalizedEmail}: ${error.message}`);
    res.status(500).json({ message: 'Failed to dispatch verification code', error: error.message });
  }
};

/**
 * Verify OTP and issue 7-day session token
 */
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 6-digit OTP code are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const challenge = otpChallenges.get(normalizedEmail);

  if (!challenge) {
    return res.status(400).json({ message: 'No active verification code found. Please request a new code.' });
  }

  if (Date.now() > challenge.expiresAt) {
    otpChallenges.delete(normalizedEmail);
    return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
  }

  if (challenge.attempts >= 5) {
    otpChallenges.delete(normalizedEmail);
    return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new code.' });
  }

  challenge.attempts += 1;

  const isMatch = await bcrypt.compare(otp.trim(), challenge.otpHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid verification code. Please check and try again.' });
  }

  // Consume challenge
  otpChallenges.delete(normalizedEmail);

  // Find or provision user
  let user = await dbService.findUserByEmail(normalizedEmail);
  const userId = user ? (user.id || user._id?.toString() || 'admin_1') : 'admin_1';
  const role = user ? user.role : challenge.role;

  const payload = {
    id: userId,
    email: normalizedEmail,
    role: role
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const refreshTokenVal = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

  logger.info(`✅ Admin authenticated successfully via OTP: ${normalizedEmail}`);

  res.json({
    token,
    refreshToken: refreshTokenVal,
    user: {
      id: userId,
      email: normalizedEmail,
      role: role
    }
  });
};

/**
 * Optional Password Fallback Login (for existing credentials)
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await dbService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      id: user.id || user._id.toString(),
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const refreshTokenVal = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      refreshToken: refreshTokenVal,
      user: {
        id: payload.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: tokenVal } = req.body;

  if (!tokenVal) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    jwt.verify(tokenVal, JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const user = await dbService.findUserByEmail(decoded.email);
      const role = user ? user.role : decoded.role || 'SuperAdmin';
      const id = user ? (user.id || user._id.toString()) : decoded.id;

      const payload = {
        id,
        email: decoded.email,
        role
      };

      const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token: newToken });
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user });
};
