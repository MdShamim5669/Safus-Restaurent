import { NextFunction, Request, Response } from 'express';
import env from '../../config/env';
import { catchAsync } from '../utils/catchAsync';
import { verifyToken } from '../utils/jwtHelpers';

export const authMiddleware = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    const verifiedUser = verifyToken(token, env.JWT_ACCESS_SECRET) as any;
    (req as any).user = verifiedUser;

    if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden access' });
    }

    next();
  });
};
