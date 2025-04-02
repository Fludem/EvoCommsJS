import 'reflect-metadata';
import { registerServices } from '../src/di/container';

// Set up environment variables for testing
process.env.NODE_ENV = 'test';

// Initialize dependency injection container
beforeAll(() => {
  registerServices();
});

// Clean up after all tests
afterAll(async () => {
  // Add any cleanup logic here if needed
}); 