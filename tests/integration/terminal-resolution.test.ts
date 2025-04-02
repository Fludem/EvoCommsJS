import { jest } from '@jest/globals';
import { TerminalResolutionService } from '../../src/services/terminal-resolution.service';
import { container } from 'tsyringe';
import { CustomerRepository } from '../../src/repositories/customer.repository';

// Mock fetch API
global.fetch = jest.fn() as jest.Mock;

// Mock the CustomerRepository
jest.mock('../../src/repositories/customer.repository', () => ({
  CustomerRepository: {
    upsert: jest.fn(),
  },
}));

describe('TerminalResolutionService', () => {
  let service: TerminalResolutionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = container.resolve(TerminalResolutionService);
  });

  describe('resolveTerminal', () => {
    it('should resolve a terminal and return customer ID when API response is successful', async () => {
      // Arrange
      const serialNumber = 'TEST123';
      const mockResponse = {
        id: 1,
        name: 'Test Terminal',
        tenant_id: 'tenant123',
        last_connection: '2023-04-01T12:00:00Z',
        serial_number: serialNumber,
        active: 1,
        customer: {
          id: 'cust123',
          primary_email: 'test@example.com',
          stripe_id: 'stripe_123',
          company_name: 'Test Company',
          employee_limit: 10,
          domain: 'test.example.com',
          can_use_app: true,
          on_active_subscription: true,
          plan_name: 'Enterprise',
          terminals_count: 1,
        },
      };

      const mockCustomerId = BigInt(12345);

      // Mock fetch to return successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      // Mock CustomerRepository.upsert to return a customer
      (CustomerRepository.upsert as jest.Mock).mockResolvedValueOnce({
        id: mockCustomerId,
        company_name: mockResponse.customer.company_name,
        domain: mockResponse.customer.domain,
        evotime_tenant_id: mockResponse.tenant_id,
      });

      // Act
      const result = await service.resolveTerminal(serialNumber);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/terminals/${serialNumber}`)
      );
      expect(CustomerRepository.upsert).toHaveBeenCalledWith({
        company_name: mockResponse.customer.company_name,
        domain: mockResponse.customer.domain,
        evotime_tenant_id: mockResponse.tenant_id,
      });
      expect(result).toEqual(mockCustomerId);
    });

    it('should return null when terminal is not found', async () => {
      // Arrange
      const serialNumber = 'UNKNOWN123';
      
      // Mock fetch to return 404
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Act
      const result = await service.resolveTerminal(serialNumber);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/terminals/${serialNumber}`)
      );
      expect(CustomerRepository.upsert).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when API call fails', async () => {
      // Arrange
      const serialNumber = 'TEST123';
      
      // Mock fetch to throw an error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Act
      const result = await service.resolveTerminal(serialNumber);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/terminals/${serialNumber}`)
      );
      expect(CustomerRepository.upsert).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
}); 