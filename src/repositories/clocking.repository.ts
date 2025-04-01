import prisma from '../utils/prisma';
import logger from '../utils/logger';

// Define the types we need explicitly
export interface Clocking {
  id: bigint;
  employee_id: bigint;
  terminal_id: bigint;
  time: Date;
  sent_to_api: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ClockingCreateInput {
  employee_id: number;
  terminal_id: number;
  time: Date;
  sent_to_api?: boolean;
}

export interface ClockingUpdateInput {
  employee_id?: number;
  terminal_id?: number;
  time?: Date;
  sent_to_api?: boolean;
}

export class ClockingRepository {
  /**
   * Find all clockings
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
   * Create a new clocking
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
   * Update a clocking
   */
  static async update(id: number, data: ClockingUpdateInput): Promise<Clocking | null> {
    try {
      // Convert number IDs to BigInt if present
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
   * Delete a clocking
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