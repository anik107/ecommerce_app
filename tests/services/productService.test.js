const ProductService = require('../../services/productService');
const Product = require('../../models/product');
const { AppError } = require('../../middleware/error-handler');

// Mock the Product model
jest.mock('../../models/product');
jest.mock('../../config/logger');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test product description',
        userId: 1
      };

      Product.create.mockResolvedValue(mockProduct);

      const productData = {
        title: 'Test Product',
        price: 29.99,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test product description'
      };

      const result = await ProductService.createProduct(1, productData);

      expect(Product.create).toHaveBeenCalledWith({
        title: 'Test Product',
        price: 29.99,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test product description',
        userId: 1
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw AppError when creation fails', async () => {
      Product.create.mockRejectedValue(new Error('Database error'));

      const productData = {
        title: 'Test Product',
        price: 29.99,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test product description'
      };

      await expect(ProductService.createProduct(1, productData))
        .rejects.toThrow(AppError);
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        userId: 1
      };

      Product.findOne.mockResolvedValue(mockProduct);

      const result = await ProductService.getProductById(1, 1);

      expect(Product.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 }
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw AppError when product not found', async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(ProductService.getProductById(1, 1))
        .rejects.toThrow(AppError);
    });
  });
});
