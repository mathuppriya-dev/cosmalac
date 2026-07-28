import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService';

const JWT_SECRET = process.env.JWT_SECRET || 'cosmalac_super_secret_key_2026!';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'cosmalac_refresh_secret_key_2026!';

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

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      refreshToken,
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
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const user = await dbService.findUserByEmail(decoded.email);
      if (!user) {
        return res.status(403).json({ message: 'User no longer exists' });
      }

      const payload = {
        id: user.id || user._id.toString(),
        email: user.email,
        role: user.role
      };

      const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
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
