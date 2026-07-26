import { NextFunction, Request, Response } from 'express';
import env from '../../config/env';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwtHelpers';

export const authMiddleware = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token =
      req.headers.authorization ||
      (req.headers['x-access-token'] as string) ||
      req.cookies?.accessToken;

    if (!token) {
      throw new AppError(401, 'Unauthorized access: No token provided in headers or cookies');
    }

    // Strip 'Bearer ' prefix if present
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    try {
      const verifiedUser = verifyToken(token as string, env.JWT_ACCESS_SECRET) as any;
      (req as any).user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(
          403,
          `Forbidden access: User role '${verifiedUser.role}' is not authorized. Required: ${requiredRoles.join(', ')}`
        );
      }

      next();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(401, 'Unauthorized access: Invalid or expired token');
    }
  });
};

function catchAsync(fn: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
