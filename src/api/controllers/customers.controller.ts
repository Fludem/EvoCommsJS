import { Request, Response } from 'express';
import { CustomerRepository } from '../../repositories/customer.repository';
import logger from '../../utils/logger';

/**
 * Controller for customer-related API endpoints
 */
export class CustomersController {
  /**
   * Get all customers
   */
  static async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await CustomerRepository.findAll();
      res.status(200).json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      logger.error(`Error in getAllCustomers: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customers',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid customer ID'
        });
        return;
      }
      
      const customer = await CustomerRepository.findById(id);
      
      if (!customer) {
        res.status(404).json({
          success: false,
          message: `Customer with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      logger.error(`Error in getCustomerById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 