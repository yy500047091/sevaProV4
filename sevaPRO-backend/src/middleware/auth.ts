import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { UserRole } from '../models/User';
import { AuthenticatedRequest } from '../types';

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: 'Missing bearer token.' });

    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string };
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'User not found.' });

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role.' });
    }
    return next();
  };
}
