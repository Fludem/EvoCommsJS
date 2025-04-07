import { Request, Response } from 'express';
import { ActivityLogRepository, ActivityLogFilter } from '../../repositories/activity-log.repository';
import logger from '../../utils/logger';

/**
 * Controller for activity log-related API endpoints
 */
export class ActivityLogsController {
  /**
   * Get all activity logs with optional filtering
   */
  static async getAllActivityLogs(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters for filtering
      const filter: ActivityLogFilter = {};
      
      if (req.query.actor_id) {
        filter.actor_id = parseInt(req.query.actor_id as string, 10);
      }
      
      if (req.query.target_type) {
        filter.target_type = req.query.target_type as string;
      }
      
      if (req.query.target_id) {
        filter.target_id = parseInt(req.query.target_id as string, 10);
      }
      
      if (req.query.activity_type) {
        filter.activity_type = req.query.activity_type as string;
      }
      
      if (req.query.action) {
        filter.action = req.query.action as string;
      }
      
      if (req.query.start_date) {
        filter.start_date = new Date(req.query.start_date as string);
      }
      
      if (req.query.end_date) {
        filter.end_date = new Date(req.query.end_date as string);
      }
      
      // Parse pagination parameters
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '100', 10);
      const offset = (page - 1) * limit;
      
      filter.limit = limit;
      filter.offset = offset;
      
      // Get activity logs and total count
      const [logs, total] = await Promise.all([
        ActivityLogRepository.findAll(filter),
        ActivityLogRepository.count(filter)
      ]);
      
      res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error(`Error in getAllActivityLogs: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve activity logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get activity log by ID
   */
  static async getActivityLogById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid activity log ID'
        });
        return;
      }
      
      const log = await ActivityLogRepository.findById(id);
      
      if (!log) {
        res.status(404).json({
          success: false,
          message: `Activity log with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: log
      });
    } catch (error) {
      logger.error(`Error in getActivityLogById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve activity log',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get activity logs by actor ID
   */
  static async getActivityLogsByActor(req: Request, res: Response): Promise<void> {
    try {
      const actorId = parseInt(req.params.actorId, 10);
      
      if (isNaN(actorId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid actor ID'
        });
        return;
      }
      
      // Parse pagination parameters
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '100', 10);
      const offset = (page - 1) * limit;
      
      // Get activity logs by actor ID and count
      const [logs, total] = await Promise.all([
        ActivityLogRepository.findByActorId(actorId, limit, offset),
        ActivityLogRepository.count({ actor_id: actorId })
      ]);
      
      res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error(`Error in getActivityLogsByActor: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve activity logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get activity logs by target type and ID
   */
  static async getActivityLogsByTarget(req: Request, res: Response): Promise<void> {
    try {
      const targetType = req.params.targetType;
      const targetId = parseInt(req.params.targetId, 10);
      
      if (!targetType) {
        res.status(400).json({
          success: false,
          message: 'Target type is required'
        });
        return;
      }
      
      if (isNaN(targetId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid target ID'
        });
        return;
      }
      
      // Parse pagination parameters
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '100', 10);
      const offset = (page - 1) * limit;
      
      // Get activity logs by target and count
      const [logs, total] = await Promise.all([
        ActivityLogRepository.findByTarget(targetType, targetId, limit, offset),
        ActivityLogRepository.count({ target_type: targetType, target_id: targetId })
      ]);
      
      res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error(`Error in getActivityLogsByTarget: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve activity logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 