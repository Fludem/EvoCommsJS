import { ActivityLogRepository, ActivityLogCreateInput } from '../repositories/activity-log.repository';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';
import { Terminal } from '../repositories/terminal.repository';
import { TerminalConnectedDetails } from '../comms/TimyAI/types/shared';
/**
 * Activity types
 */
export enum ActivityType {
  CLOCKING_CREATED = 'CLOCKING_CREATED',
  CLOCKING_UPDATED = 'CLOCKING_UPDATED',
  TERMINAL_CONNECTED = 'TERMINAL_CONNECTED',
  TERMINAL_DISCONNECTED = 'TERMINAL_DISCONNECTED',
  TERMINAL_REGISTERED = 'TERMINAL_REGISTERED',
  TERMINAL_UPDATED = 'TERMINAL_UPDATED',
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED',
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED'
}

/**
 * Target types
 */
export enum TargetType {
  CLOCKING = 'CLOCKING',
  TERMINAL = 'TERMINAL',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER'
}

/**
 * Action types
 */
export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT'
}

/**
 * Service for logging activities
 */
export class ActivityLogService {
  /**
   * Convert a Record to Prisma.JsonValue
   */
  private static toJsonValue(obj: Record<string, unknown> | null): Prisma.JsonValue | null {
    if (obj === null) return null;
    return obj as Prisma.JsonValue;
  }

  /**
   * Log a clocking creation
   * @param clockingId - ID of the created clocking
   * @param terminalId - ID of the terminal that created the clocking
   * @param employeeId - ID of the employee associated with the clocking
   * @param details - Additional details
   */
  static async logClockingCreated(
    clockingId: number,
    terminalId: number,
    employeeId: number,
    details?: Record<string, unknown>
  ): Promise<void> {
    try {
      const detailsObj = { employee_id: employeeId };
      if (details) {
        Object.assign(detailsObj, details);
      }

      await ActivityLogRepository.create({
        activity_type: ActivityType.CLOCKING_CREATED,
        actor_id: terminalId,
        target_type: TargetType.CLOCKING,
        target_id: clockingId,
        action: ActionType.CREATE,
        details: this.toJsonValue(detailsObj)
      });
    } catch (error) {
      logger.error(`Error logging clocking creation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Log a terminal connection
   * @param terminalId - ID of the terminal that connected
   * @param serialNumber - Serial number of the terminal
   * @param details - Additional details
   */
  static async logTerminalConnected(
    terminal: Terminal,
    terminalConnectedDetails: TerminalConnectedDetails
  ): Promise<void> {
    try {
      const detailsObj = { serial_number: terminal.serial_number, customer_id: terminalConnectedDetails.customerId, customer_name: terminalConnectedDetails.customerName, ip_address: terminalConnectedDetails.ipAddress };


      await ActivityLogRepository.create({
        activity_type: ActivityType.TERMINAL_CONNECTED,
        actor_id: terminal.id,
        target_type: TargetType.TERMINAL,
        target_id: terminal.id,
        action: ActionType.CONNECT,
        details: this.toJsonValue(detailsObj)
      });
    } catch (error) {
      logger.error(`Error logging terminal connection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Log a terminal disconnection
   * @param terminalId - ID of the terminal that disconnected
   * @param serialNumber - Serial number of the terminal
   * @param details - Additional details
   */
  static async logTerminalDisconnected(
    terminalId: number,
    serialNumber: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    try {
      const detailsObj = { serial_number: serialNumber };
      if (details) {
        Object.assign(detailsObj, details);
      }

      await ActivityLogRepository.create({
        activity_type: ActivityType.TERMINAL_DISCONNECTED,
        actor_id: terminalId,
        target_type: TargetType.TERMINAL,
        target_id: terminalId,
        action: ActionType.DISCONNECT,
        details: this.toJsonValue(detailsObj)
      });
    } catch (error) {
      logger.error(`Error logging terminal disconnection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Log a terminal registration
   * @param terminalId - ID of the terminal that registered
   * @param serialNumber - Serial number of the terminal
   * @param customerId - ID of the customer associated with the terminal
   * @param details - Additional details
   */
  static async logTerminalRegistered(
    terminalId: number,
    serialNumber: string,
    customerId: number,
    details?: Record<string, unknown>
  ): Promise<void> {
    try {
      const detailsObj = { 
        serial_number: serialNumber,
        customer_id: customerId
      };
      
      if (details) {
        Object.assign(detailsObj, details);
      }
      
      await ActivityLogRepository.create({
        activity_type: ActivityType.TERMINAL_REGISTERED,
        actor_id: terminalId,
        target_type: TargetType.TERMINAL,
        target_id: terminalId,
        action: ActionType.CREATE,
        details: this.toJsonValue(detailsObj)
      });
    } catch (error) {
      logger.error(`Error logging terminal registration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Log an employee creation
   * @param employeeId - ID of the created employee
   * @param terminalId - ID of the terminal that created the employee
   * @param details - Additional details
   */
  static async logEmployeeCreated(
    employeeId: number,
    terminalId: number,
    details?: Record<string, unknown>
  ): Promise<void> {
    try {
      await ActivityLogRepository.create({
        activity_type: ActivityType.EMPLOYEE_CREATED,
        actor_id: terminalId,
        target_type: TargetType.EMPLOYEE,
        target_id: employeeId,
        action: ActionType.CREATE,
        details: this.toJsonValue(details || null)
      });
    } catch (error) {
      logger.error(`Error logging employee creation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Log a generic activity
   * @param activityType - Type of activity
   * @param actorId - ID of the actor performing the activity
   * @param targetType - Type of target affected by the activity
   * @param targetId - ID of the target affected by the activity
   * @param action - Action performed
   * @param details - Additional details
   */
  static async logActivity(
    activityType: ActivityType,
    actorId: number | null,
    targetType: TargetType | null,
    targetId: number | null,
    action: ActionType,
    details?: Record<string, unknown>
  ): Promise<void> {
    try {
      const data: ActivityLogCreateInput = {
        activity_type: activityType,
        actor_id: actorId,
        target_type: targetType,
        target_id: targetId,
        action,
        details: this.toJsonValue(details || null)
      };

      await ActivityLogRepository.create(data);
    } catch (error) {
      logger.error(`Error logging activity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 