import { jest } from '@jest/globals';
import { CustomerRepository } from '../../src/repositories/customer.repository';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    customer: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

let prismaClient: any;

describe('CustomerRepository', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Get instance of mocked PrismaClient
    prismaClient = new PrismaClient();
  });

  describe('findById', () => {
    it('should find a customer by ID', async () => {
      // Arrange
      const customerId = BigInt(1);
      const expectedCustomer = {
        id: customerId,
        company_name: 'Test Company',
        domain: 'test.example.com',
        evotime_tenant_id: 'tenant123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mock Prisma response
      prismaClient.customer.findUnique.mockResolvedValueOnce(expectedCustomer);

      // Act
      const customer = await CustomerRepository.findById(customerId);

      // Assert
      expect(prismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerId },
      });
      expect(customer).toEqual(expectedCustomer);
    });

    it('should return null when customer is not found', async () => {
      // Arrange
      const customerId = BigInt(999);
      
      // Mock Prisma response
      prismaClient.customer.findUnique.mockResolvedValueOnce(null);

      // Act
      const customer = await CustomerRepository.findById(customerId);

      // Assert
      expect(prismaClient.customer.findUnique).toHaveBeenCalledWith({
        where: { id: customerId },
      });
      expect(customer).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should create or update a customer', async () => {
      // Arrange
      const customerData = {
        company_name: 'New Company',
        domain: 'new.example.com',
        evotime_tenant_id: 'newtenant123',
      };
      const expectedCustomer = {
        id: BigInt(1),
        ...customerData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mock Prisma response
      prismaClient.customer.upsert.mockResolvedValueOnce(expectedCustomer);

      // Act
      const customer = await CustomerRepository.upsert(customerData);

      // Assert
      expect(prismaClient.customer.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { evotime_tenant_id: customerData.evotime_tenant_id },
        create: expect.objectContaining(customerData),
        update: expect.objectContaining({
          company_name: customerData.company_name,
          domain: customerData.domain,
        }),
      }));
      expect(customer).toEqual(expectedCustomer);
    });
  });

  // Add more test cases for other repository methods
}); 