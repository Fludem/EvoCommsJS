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
  id: bigint;
  employee_id: bigint;
  terminal_id: bigint;
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
      return await prisma.clockings.findMany();
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
      return await prisma.clockings.findUnique({
        where: { id: BigInt(id) },
      });
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
      return await prisma.clockings.findMany({
        where: { employee_id: BigInt(employeeId) },
        orderBy: { time: 'desc' },
      });
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
      // Convert number IDs to BigInt
      const clockingData = {
        ...data,
        employee_id: BigInt(data.employee_id),
        terminal_id: BigInt(data.terminal_id)
      };
      
      return await prisma.clockings.create({ data: clockingData });
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
      const updateData: Record<string, unknown> = { ...data };
      if (data.employee_id !== undefined) {
        updateData.employee_id = BigInt(data.employee_id);
      }
      if (data.terminal_id !== undefined) {
        updateData.terminal_id = BigInt(data.terminal_id);
      }
      
      return await prisma.clockings.update({
        where: { id: BigInt(id) },
        data: updateData,
      });
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
      return await prisma.clockings.update({
        where: { id: BigInt(id) },
        data: { sent_to_api: true },
      });
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
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting clocking: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 