import prisma from '../utils/prisma';
import logger from '../utils/logger';

// Define the types we need explicitly
export interface Customer {
  id: bigint;
  company_name: string | null;
  domain: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerCreateInput {
  company_name?: string | null;
  domain?: string | null;
}

export interface CustomerUpdateInput {
  company_name?: string | null;
  domain?: string | null;
}

export class CustomerRepository {
  /**
   * Find all customers
   */
  static async findAll(): Promise<Customer[]> {
    try {
      return await prisma.customers.findMany();
    } catch (error) {
      logger.error(`Error finding all customers: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find a customer by ID
   */
  static async findById(id: number): Promise<Customer | null> {
    try {
      return await prisma.customers.findUnique({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      logger.error(`Error finding customer by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find a customer by domain
   */
  static async findByDomain(domain: string): Promise<Customer | null> {
    try {
      return await prisma.customers.findFirst({
        where: { domain },
      });
    } catch (error) {
      logger.error(`Error finding customer by domain: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Create a new customer
   */
  static async create(data: CustomerCreateInput): Promise<Customer | null> {
    try {
      return await prisma.customers.create({ data });
    } catch (error) {
      logger.error(`Error creating customer: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a customer
   */
  static async update(id: number, data: CustomerUpdateInput): Promise<Customer | null> {
    try {
      return await prisma.customers.update({
        where: { id: BigInt(id) },
        data,
      });
    } catch (error) {
      logger.error(`Error updating customer: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete a customer
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.customers.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting customer: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 