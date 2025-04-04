import { Request, Response } from 'express';
import { TerminalRepository } from '../../repositories/terminal.repository';
import logger from '../../utils/logger';

/**
 * Controller for terminal-related API endpoints
 */
export class TerminalsController {
  /**
   * Get all terminals
   */
  static async getAllTerminals(req: Request, res: Response): Promise<void> {
    try {
      const terminals = await TerminalRepository.findAll();
      res.status(200).json({
        success: true,
        data: terminals,
        count: terminals.length
      });
    } catch (error) {
      logger.error(`Error in getAllTerminals: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve terminals',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get terminal by ID
   */
  static async getTerminalById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid terminal ID'
        });
        return;
      }
      
      const terminal = await TerminalRepository.findById(id);
      
      if (!terminal) {
        res.status(404).json({
          success: false,
          message: `Terminal with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: terminal
      });
    } catch (error) {
      logger.error(`Error in getTerminalById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve terminal',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get terminal by serial number
   */
  static async getTerminalBySerialNumber(req: Request, res: Response): Promise<void> {
    try {
      const serialNumber = req.params.serialNumber;
      
      if (!serialNumber) {
        res.status(400).json({
          success: false,
          message: 'Serial number is required'
        });
        return;
      }
      
      const terminal = await TerminalRepository.findBySerialNumber(serialNumber);
      
      if (!terminal) {
        res.status(404).json({
          success: false,
          message: `Terminal with serial number ${serialNumber} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: terminal
      });
    } catch (error) {
      logger.error(`Error in getTerminalBySerialNumber: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve terminal',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 