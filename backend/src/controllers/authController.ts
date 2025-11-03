import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import userService from '../services.ts/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await userService.getUserByEmail(String(email));
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // @ts-ignore - comparePassword exists on IUser
      const ok = await user.comparePassword(String(password));
      if (!ok) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { sub: user._id.toString(), email: user.email },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN as any } as jwt.SignOptions
      );

      res.status(200).json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Login failed' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ')
        ? auth.slice('Bearer '.length)
        : undefined;
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret) as any;
      const userId = decoded?.sub as string | undefined;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (e: any) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export default new AuthController();
