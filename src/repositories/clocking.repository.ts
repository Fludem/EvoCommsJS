import prisma from '../utils/prisma';
import logger from '../utils/logger';

/**
 * Clocking
 * @param id - The ID of the clocking
 * @param employee_id - The ID of the employee
 * @param terminal_id - The ID of the terminal
 * @param time - The time of the clocking
 * @param sent_to_api - Whether the clocking has been sent to the API
 */
export interface Clocking {
  id: number;
  employee_id: number;
  terminal_id: number;
  time: Date;
  sent_to_api: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Required fields for creating a clocking
 * @param employee_id - The ID of the employee who clocked in
 * @param terminal_id - The ID of the terminal that it came from
 * @param time - The time the employee clocked
 */
export interface ClockingCreateInput {
  employee_id: number;
  terminal_id: number;
  time: Date;
  sent_to_api?: boolean;
}

/**
 * Required fields for updating a clocking
 * @param employee_id - The ID of the employee who clocked in
 * @param terminal_id - The ID of the terminal that it came from
 * @param time - The time the employee clocked
 */
export interface ClockingUpdateInput {
  employee_id?: number;
  terminal_id?: number;
  time?: Date;
  sent_to_api?: boolean;
}

/**
 * Clocking repository for interacting with the clockings table
 */ 
export class ClockingRepository {
  /**
   * Find all clockings
   * @returns All clockings
   */
  static async findAll(): Promise<Clocking[]> {
    try {
      const results = await prisma.clockings.findMany();
      return results.map(clocking => ({
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      }));
    } catch (error) {
      logger.error(`Error finding all clockings: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find a clocking by ID  
   * @param id - The ID of the clocking to find
   * @returns The clocking or null if not found
   */
  static async findById(id: number): Promise<Clocking | null> {
    try {
      const clocking = await prisma.clockings.findUnique({
        where: { id },
      });
      
      if (!clocking) return null;
      
      return {
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      };
    } catch (error) {
      logger.error(`Error finding clocking by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find clockings by employee ID  
   * @param employeeId - The ID of the employee to find clockings for
   * @returns The clockings or an empty array if not found
   */
  static async findByEmployeeId(employeeId: number): Promise<Clocking[]> {
    try {
      const results = await prisma.clockings.findMany({
        where: { employee_id: employeeId },
        orderBy: { time: 'desc' },
      });
      
      return results.map(clocking => ({
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      }));
    } catch (error) {
      logger.error(`Error finding clockings by employee ID: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Store a new clocking in DB
   * @param data - The data for the clocking to create
   * @returns The created clocking or null if an error occurs
   */
  static async create(data: ClockingCreateInput): Promise<Clocking | null> {
    try {
      const clocking = await prisma.clockings.create({ 
        data: {
          employee_id: data.employee_id,
          terminal_id: data.terminal_id,
          time: data.time,
          sent_to_api: data.sent_to_api ?? false
        }
      });
      
      return {
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      };
    } catch (error) {
      logger.error(`Error creating clocking: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a clocking in DB
   * @param id - The ID of the clocking to update
   * @param data - The data for the clocking to update
   * @returns The updated clocking or null if an error occurs
   */
  static async update(id: number, data: ClockingUpdateInput): Promise<Clocking | null> {
    try {
      const clocking = await prisma.clockings.update({
        where: { id },
        data,
      });
      
      return {
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      };
    } catch (error) {
      logger.error(`Error updating clocking: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Mark a clocking as sent to API
   * @param id - The ID of the clocking to mark as sent
   * @returns The updated clocking or null if an error occurs
   */
  static async markAsSent(id: number): Promise<Clocking | null> {
    try {
      const clocking = await prisma.clockings.update({
        where: { id },
        data: { sent_to_api: true },
      });
      
      return {
        ...clocking,
        id: Number(clocking.id),
        employee_id: Number(clocking.employee_id),
        terminal_id: Number(clocking.terminal_id)
      };
    } catch (error) {
      logger.error(`Error marking clocking as sent: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete a clocking from DB
   * @param id - The ID of the clocking to delete
   * @returns True if the clocking was deleted, false otherwise
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.clockings.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting clocking: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 