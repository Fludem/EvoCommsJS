import prisma from '../utils/prisma';
import logger from '../utils/logger';

// Define the types we need explicitly
export interface Terminal {
  id: bigint;
  serial_number: string;
  firmware: string;
  terminal_type: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id: bigint | null;
  last_seen: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TerminalCreateInput {
  serial_number: string;
  firmware: string;
  terminal_type: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id?: number | null;
  last_seen?: Date;
}

export interface TerminalUpdateInput {
  serial_number?: string;
  firmware?: string;
  terminal_type?: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id?: number | null;
  last_seen?: Date;
}

export class TerminalRepository {
  /**
   * Find all terminals
   */
  static async findAll(): Promise<Terminal[]> {
    try {
      return await prisma.terminals.findMany();
    } catch (error) {
      logger.error(`Error finding all terminals: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find a terminal by ID
   */
  static async findById(id: number): Promise<Terminal | null> {
    try {
      return await prisma.terminals.findUnique({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      logger.error(`Error finding terminal by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find a terminal by serial number
   */
  static async findBySerialNumber(serialNumber: string): Promise<Terminal | null> {
    try {
      return await prisma.terminals.findUnique({
        where: { serial_number: serialNumber },
      });
    } catch (error) {
      logger.error(`Error finding terminal by serial number: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Create a new terminal
   */
  static async create(data: TerminalCreateInput): Promise<Terminal | null> {
    try {
      // Convert customer_id to BigInt if present
      const createData = {
        serial_number: data.serial_number,
        firmware: data.firmware,
        terminal_type: data.terminal_type,
        last_seen: data.last_seen || new Date()
      };
      
      // Only add customer_id if it's defined and not null
      if (data.customer_id !== undefined && data.customer_id !== null) {
        const finalData = {
          ...createData,
          customer_id: BigInt(data.customer_id)
        };
        return await prisma.terminals.create({ data: finalData });
      }
      
      return await prisma.terminals.create({ data: createData });
    } catch (error) {
      logger.error(`Error creating terminal: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a terminal
   */
  static async update(id: number, data: TerminalUpdateInput): Promise<Terminal | null> {
    try {
      // Create a base update data object without customer_id
      const baseUpdateData = {
        ...(data.serial_number !== undefined && { serial_number: data.serial_number }),
        ...(data.firmware !== undefined && { firmware: data.firmware }),
        ...(data.terminal_type !== undefined && { terminal_type: data.terminal_type }),
        ...(data.last_seen !== undefined && { last_seen: data.last_seen })
      };
      
      // Add customer_id handling separately to ensure correct type
      let updateData;
      if (data.customer_id === null) {
        updateData = { ...baseUpdateData, customer_id: null };
      } else if (data.customer_id !== undefined) {
        updateData = { ...baseUpdateData, customer_id: BigInt(data.customer_id) };
      } else {
        updateData = baseUpdateData;
      }
      
      return await prisma.terminals.update({
        where: { id: BigInt(id) },
        data: updateData,
      });
    } catch (error) {
      logger.error(`Error updating terminal: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a terminal's last seen timestamp
   */
  static async updateLastSeen(id: number): Promise<Terminal | null> {
    try {
      return await prisma.terminals.update({
        where: { id: BigInt(id) },
        data: { last_seen: new Date() },
      });
    } catch (error) {
      logger.error(`Error updating terminal last seen: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete a terminal
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.terminals.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting terminal: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 