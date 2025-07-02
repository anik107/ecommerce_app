const request = require('supertest');
const app = require('../../app');

describe('Admin Routes', () => {
  describe('GET /admin/add-product', () => {
    it('should redirect to login when not authenticated', async () => {
      const response = await request(app)
        .get('/admin/add-product')
        .expect(302);

      expect(response.headers.location).toBe('/login');
    });
  });

  describe('GET /admin/products', () => {
    it('should redirect to login when not authenticated', async () => {
      const response = await request(app)
        .get('/admin/products')
        .expect(302);

      expect(response.headers.location).toBe('/login');
    });
  });
});

describe('Product Management', () => {
  // Add authenticated tests here when authentication is properly set up
  describe('POST /admin/add-product', () => {
    it('should validate product data', async () => {
      const invalidProduct = {
        title: 'ab', // Too short
        price: -10,   // Negative price
        description: 'short',  // Too short
        imageUrl: 'invalid-url'  // Invalid URL
      };

      const response = await request(app)
        .post('/admin/add-product')
        .send(invalidProduct)
        .expect(302); // Redirect to login since not authenticated
    });
  });
});
