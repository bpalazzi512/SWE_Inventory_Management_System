import User, { IUser } from '../models/User';
import { Types } from 'mongoose';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export class UserService {
  // Create a new user
  async createUser(userData: CreateUserDto): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findById(id).select('-password');
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  // Update user by ID
  async updateUser(id: string, userData: UpdateUserDto): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await User.findByIdAndUpdate(
      id,
      { $set: userData },
      { new: true, runValidators: true }
    ).select('-password');
    return user;
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new UserService();

