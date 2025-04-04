import { injectable } from 'tsyringe';
import { createLogger } from '../utils/logger';
import { CustomerRepository } from '../repositories/customer.repository';

interface EvoTimeTerminalResponse {
  id: number;
  name: string;
  tenant_id: string;
  last_connection: string;
  serial_number: string;
  active: number;
  customer: {
    id: string;
    primary_email: string;
    stripe_id: string;
    company_name: string;
    employee_limit: number;
    domain: string;
    can_use_app: boolean;
    on_active_subscription: boolean;
    plan_name: string;
    terminals_count: number;
  };
}

@injectable()
export class TerminalResolutionService {
  private readonly logger = createLogger('TerminalResolutionService');
  private readonly API_BASE_URL = 'https://comms.evotime.com/api/v1';

  constructor() {}

  /**
   * Resolve a terminal's customer information from the EvoTime API
   * @param serialNumber - The serial number of the terminal to resolve
   * @returns The customer ID if found and created/updated, null otherwise
   */
  async resolveTerminal(serialNumber: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/terminals/${serialNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          this.logger.warn(`Terminal ${serialNumber} not found in EvoTime API`);
          return null;
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as EvoTimeTerminalResponse;
      
      // Create or update the customer record
      const customer = await CustomerRepository.upsert({
        company_name: data.customer.company_name,
        domain: data.customer.domain,
        evotime_tenant_id: data.tenant_id
      });

      if (!customer) {
        throw new Error('Failed to create/update customer record');
      }

      return customer.id;
    } catch (error) {
      this.logger.error(`Error resolving terminal ${serialNumber}: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
} 