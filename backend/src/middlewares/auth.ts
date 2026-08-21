import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isMockDB } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'cosmalac_super_secret_key_2026!';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'SuperAdmin' | 'Editor' | 'Viewer';
  };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (isMockDB) {
          (req as AuthenticatedRequest).user = {
            id: 'user_0',
            email: 'admin@cosmalac.com',
            role: 'SuperAdmin'
          };
          return next();
        }
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
      }

      (req as AuthenticatedRequest).user = decoded;
      next();
    });
  } else {
    if (isMockDB) {
      (req as AuthenticatedRequest).user = {
        id: 'user_0',
        email: 'admin@cosmalac.com',
        role: 'SuperAdmin'
      };
      return next();
    }
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

export const requireRole = (allowedRoles: ('SuperAdmin' | 'Editor' | 'Viewer')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

export default { authenticateJWT, requireRole };
