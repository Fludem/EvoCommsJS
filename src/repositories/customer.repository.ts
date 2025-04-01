import prisma from '../utils/prisma';
import logger from '../utils/logger';

/**
 * Customer
 * @param id - The ID of the customer
 * @param company_name - The customers company name
 * @param domain - The customers domain on evotime typically something like "companyname.evotime.com"
 * @param created_at - The date and time the customer was created
 * @param updated_at - The date and time the customer was last updated
 */
export interface Customer {
  id: bigint;
  company_name: string | null;
  domain: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Required fields for creating a customer in DB
 * @param company_name - The name of the company
 * @param domain - The domain of the company
 */
export interface CustomerCreateInput {
  company_name?: string | null;
  domain?: string | null;
}

/**
 * Required fields for updating a customer in DB
 * @param company_name - The name of the company
 * @param domain - The domain of the company
 */
export interface CustomerUpdateInput {
  company_name?: string | null;
  domain?: string | null;
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
      return await prisma.customers.findMany();
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
   * @param domain - The domain of the customer to find
   * @returns The customer or null if not found
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
   * Create a new customer in DB
   * @param data - The data for the customer to create
   * @returns The created customer or null if an error occurs
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
   * Update a customer in DB
   * @param id - The ID of the customer to update
   * @param data - The data for the customer to update
   * @returns The updated customer or null if an error occurs
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
   * Delete a customer from DB  
   * @param id - The ID of the customer to delete
   * @returns True if the customer was deleted, false otherwise
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