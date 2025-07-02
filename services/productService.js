const Product = require('../models/product');
const { AppError } = require('../middleware/error-handler');
const logger = require('../config/logger');

class ProductService {
  static async createProduct(userId, productData) {
    try {
      const { title, price, imageUrl, description } = productData;

      const product = await Product.create({
        title,
        price,
        imageUrl,
        description,
        userId
      });

      logger.info(`Product created: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new AppError('Failed to create product', 500);
    }
  }

  static async getProductById(productId, userId = null) {
    try {
      const whereClause = { id: productId };
      if (userId) {
        whereClause.userId = userId;
      }

      const product = await Product.findOne({ where: whereClause });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching product:', error);
      throw new AppError('Failed to fetch product', 500);
    }
  }

  static async updateProduct(productId, userId, updateData) {
    try {
      const product = await this.getProductById(productId, userId);

      const { title, price, imageUrl, description } = updateData;

      await product.update({
        title,
        price,
        imageUrl,
        description
      });

      logger.info(`Product updated: ${product.id}`);
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating product:', error);
      throw new AppError('Failed to update product', 500);
    }
  }

  static async deleteProduct(productId, userId) {
    try {
      const product = await this.getProductById(productId, userId);

      await product.destroy();

      logger.info(`Product deleted: ${productId}`);
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting product:', error);
      throw new AppError('Failed to delete product', 500);
    }
  }

  static async getProductsByUser(userId) {
    try {
      const products = await Product.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });

      return products;
    } catch (error) {
      logger.error('Error fetching user products:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  static async getAllProducts() {
    try {
      const products = await Product.findAll({
        order: [['createdAt', 'DESC']]
      });

      return products;
    } catch (error) {
      logger.error('Error fetching all products:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }
}

module.exports = ProductService;
