// Test setup file
require('dotenv').config({ path: '.env.test' });

// Mock logger to prevent log output during tests
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));
