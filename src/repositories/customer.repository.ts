import prisma from '../utils/prisma';
import logger from '../utils/logger';

/**
 * Customer
 * @param id - The ID of the customer
 * @param company_name - The name of the company
 * @param domain - The domain of the company
 * @param evotime_tenant_id - The ID of the tenant in EvoTime
 * @param created_at - The date and time the customer was created
 * @param updated_at - The date and time the customer was last updated
 */
export interface Customer {
  id: number;
  company_name: string;
  domain: string;
  evotime_tenant_id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Required fields for creating a customer
 * @param company_name - The name of the company
 * @param domain - The domain of the company
 * @param evotime_tenant_id - The ID of the tenant in EvoTime
 */
export interface CustomerCreateInput {
  company_name: string;
  domain: string;
  evotime_tenant_id: string;
}

/**
 * Required fields for updating a customer
 * @param company_name - The name of the company
 * @param domain - The domain of the company
 * @param evotime_tenant_id - The ID of the tenant in EvoTime
 */
export interface CustomerUpdateInput {
  company_name?: string;
  domain?: string;
  evotime_tenant_id?: string;
}

/**
 * Customer repository for interacting with the customers table
 */
export class CustomerRepository {
  /**
   * Find all customers
   * @returns All customers
   */
  static async findAll(): Promise<Customer[]> {
    try {
      const results = await prisma.customers.findMany();
      return results.map(customer => ({
        ...customer,
        id: Number(customer.id)
      }));
    } catch (error) {
      logger.error(`Error finding all customers: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find a customer by ID
   * @param id - The ID of the customer to find
   * @returns The customer or null if not found
   */
  static async findById(id: number): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.findUnique({
        where: { id },
      });
      
      if (!customer) return null;
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error finding customer by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find a customer by domain
   * @param domain - The domain of the customer to find
   * @returns The customer or null if not found
   */
  static async findByDomain(domain: string): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.findUnique({
        where: { domain },
      });
      
      if (!customer) return null;
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error finding customer by domain: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find a customer by EvoTime tenant ID
   * @param tenantId - The EvoTime tenant ID of the customer to find
   * @returns The customer or null if not found
   */
  static async findByEvoTimeTenantId(tenantId: string): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.findUnique({
        where: { evotime_tenant_id: tenantId },
      });
      
      if (!customer) return null;
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error finding customer by EvoTime tenant ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Store a new customer in DB
   * @param data - The data for the customer to create
   * @returns The created customer or null if an error occurs
   */
  static async create(data: CustomerCreateInput): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.create({
        data,
      });
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error creating customer: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a customer in DB
   * @param id - The ID of the customer to update
   * @param data - The data for the customer to update
   * @returns The updated customer or null if an error occurs
   */
  static async update(id: number, data: CustomerUpdateInput): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.update({
        where: { id },
        data,
      });
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error updating customer: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Upsert a customer - create if it doesn't exist, update if it does
   * @param data - The data for the customer to upsert
   * @returns The upserted customer or null if an error occurs
   */
  static async upsert(data: CustomerCreateInput): Promise<Customer | null> {
    try {
      const customer = await prisma.customers.upsert({
        where: { evotime_tenant_id: data.evotime_tenant_id },
        create: data,
        update: {
          company_name: data.company_name,
          domain: data.domain
        }
      });
      
      return {
        ...customer,
        id: Number(customer.id)
      };
    } catch (error) {
      logger.error(`Error upserting customer: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete a customer from DB
   * @param id - The ID of the customer to delete
   * @returns True if the customer was deleted, false otherwise
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.customers.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting customer: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 