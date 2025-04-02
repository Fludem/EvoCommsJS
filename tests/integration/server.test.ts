import { jest } from '@jest/globals';
import request from 'supertest';
import { Server } from '../../src/server';
import { container } from 'tsyringe';

// Mock any external dependencies
jest.mock('../../src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }),
}));

describe('Server', () => {
  let server: Server;
  let httpServer: any;

  beforeAll(async () => {
    server = new Server();
    await server.start();
    // @ts-ignore - accessing private property for testing
    httpServer = server['server'];
  });

  afterAll(async () => {
    if (httpServer && httpServer.listening) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          resolve();
        });
      });
    }
  });

  describe('Health check endpoint', () => {
    it('should return 200 OK with status', async () => {
      // Act
      const response = await request(httpServer).get('/health');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  // Add more API endpoint tests as needed
}); 