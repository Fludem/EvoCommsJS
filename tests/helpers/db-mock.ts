import { jest } from '@jest/globals';

// Database mocking helper
export const mockDatabase = () => {
  // Create mock implementations for database operations
  const dbMocks = {
    findOne: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  };

  // Reset all mocks between tests
  beforeEach(() => {
    Object.values(dbMocks).forEach(mock => mock.mockReset());
  });

  return dbMocks;
};

// Function to mock Prisma client
export const mockPrismaClient = () => {
  // Mock each model and its methods
  const mockClient = {
    customer: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    terminal: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    clocking: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    // Add other models as needed
  };

  // Reset all mocks between tests
  beforeEach(() => {
    Object.values(mockClient).forEach(model => {
      Object.values(model).forEach(method => {
        method.mockReset();
      });
    });
  });

  return mockClient;
}; 