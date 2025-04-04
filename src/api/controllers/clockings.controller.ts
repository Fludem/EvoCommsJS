import { Request, Response } from 'express';
import { ClockingRepository } from '../../repositories/clocking.repository';
import logger from '../../utils/logger';

/**
 * Controller for clocking-related API endpoints
 */
export class ClockingsController {
  /**
   * Get all clockings
   */
  static async getAllClockings(req: Request, res: Response): Promise<void> {
    try {
      const clockings = await ClockingRepository.findAll();
      
      res.status(200).json({
        success: true,
        data: clockings,
        count: clockings.length
      });
    } catch (error) {
      logger.error(`Error in getAllClockings: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve clockings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get clocking by ID
   */
  static async getClockingById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid clocking ID'
        });
        return;
      }
      
      const clocking = await ClockingRepository.findById(id);
      
      if (!clocking) {
        res.status(404).json({
          success: false,
          message: `Clocking with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: clocking
      });
    } catch (error) {
      logger.error(`Error in getClockingById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve clocking',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get clockings by employee ID
   */
  static async getClockingsByEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = parseInt(req.params.employeeId, 10);
      
      if (isNaN(employeeId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid employee ID'
        });
        return;
      }
      
      const clockings = await ClockingRepository.findByEmployeeId(employeeId);
      
      res.status(200).json({
        success: true,
        data: clockings,
        count: clockings.length
      });
    } catch (error) {
      logger.error(`Error in getClockingsByEmployee: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve clockings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 