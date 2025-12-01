import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'woohoo-testing';
const API_KEY_HEADER = process.env.API_KEY_HEADER || 'x-api-key';

export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Allow missing API key in development if explicitly disabled
  if (process.env.DISABLE_API_KEY_CHECK === 'true') {
    return next();
  }

  const providedKey =
    (req.headers[API_KEY_HEADER.toLowerCase()] as string | undefined) ??
    (req.headers['x-api-key'] as string | undefined);

  if (!providedKey || providedKey !== API_KEY) {
    res.status(401).json({ error: 'Invalid or missing API key' });
    return;
  }

  next();
};

export default validateApiKey;


