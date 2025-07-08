const User = require('../models/user');
const Cart = require('../models/cart');
const { AppError } = require('../middleware/error-handler');
const logger = require('../config/logger');

class UserService {
  static async createUser(userData) {
    try {
      const { name, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const user = await User.create({ name, email, password });

      // Create cart for new user
      await user.createCart();

      logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching user:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  static async updateUser(userId, updateData) {
    try {
      const user = await this.getUserById(userId);

      const { name, email } = updateData;

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new AppError('Email already in use', 400);
        }
      }

      await user.update({ name, email });

      logger.info(`User updated: ${user.id}`);
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating user:', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await this.getUserById(userId);

      await user.destroy();

      logger.info(`User deleted: ${userId}`);
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting user:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }
}

module.exports = UserService;
