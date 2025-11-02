import { Request, Response } from 'express';
import userService, { CreateUserDto, UpdateUserDto } from '../services.ts/userService';

export class UserController {
  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      };

      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      // Check if user already exists
      const existingUser = await userService.getUserByEmail(userData.email);
      if (existingUser) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      const user = await userService.createUser(userData);
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create user' });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch user' });
    }
  }

  // Update user by ID
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const updateData: UpdateUserDto = {};

      if (req.body.firstName) updateData.firstName = req.body.firstName;
      if (req.body.lastName) updateData.lastName = req.body.lastName;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) updateData.password = req.body.password;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      // If email is being updated, check if it's already taken
      if (updateData.email) {
        const existingUser = await userService.getUserByEmail(updateData.email);
        if (existingUser && existingUser._id.toString() !== id) {
          res.status(409).json({ error: 'Email already in use' });
          return;
        }
      }

      const user = await userService.updateUser(id, updateData);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update user' });
    }
  }

  // Delete user by ID
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete user' });
    }
  }
}

export default new UserController();

