import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Extend Express Request type to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header provided' });
      return;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : authHeader;

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret) as {
      sub: string;
      email: string;
    };

    // Attach user info to request object
    req.user = {
      userId: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token has expired' });
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
};

