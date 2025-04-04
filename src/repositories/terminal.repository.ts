import prisma from '../utils/prisma';
import logger from '../utils/logger';

/**
 * Terminal
 * @param id - The ID of the terminal
 * @param serial_number - The serial number of the terminal
 * @param firmware - The firmware version of the terminal
 * @param terminal_type - The type of terminal
 * @param customer_id - The ID of the customer the terminal belongs to
 * @param last_seen - The last time the terminal was seen
 * @param created_at - The date and time the terminal was created
 * @param updated_at - The date and time the terminal was last updated
 */
export interface Terminal {
  id: number;
  serial_number: string;
  firmware: string;
  terminal_type: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id: number;
  last_seen: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Required fields for creating a terminal
 * @param serial_number - The serial number of the terminal
 * @param firmware - The firmware version of the terminal
 * @param terminal_type - The type of terminal
 * @param customer_id - The ID of the customer the terminal belongs to
 */
export interface TerminalCreateInput {
  serial_number: string;
  firmware: string;
  terminal_type: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id: number;
  last_seen?: Date;
}

/**
 * Required fields for updating a terminal
 * @param serial_number - The serial number of the terminal
 * @param firmware - The firmware version of the terminal
 * @param terminal_type - The type of terminal
 * @param customer_id - The ID of the customer the terminal belongs to
 */
export interface TerminalUpdateInput {
  serial_number?: string;
  firmware?: string;
  terminal_type?: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id?: number;
  last_seen?: Date;
}

/**
 * Terminal repository for interacting with the terminals table
 */
export class TerminalRepository {
  /**
   * Find all terminals
   * @returns All terminals
   */
  static async findAll(): Promise<Terminal[]> {
    try {
      const results = await prisma.terminals.findMany();
      return results.map(terminal => ({
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      }));
    } catch (error) {
      logger.error(`Error finding all terminals: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find a terminal by ID
   * @param id - The ID of the terminal to find
   * @returns The terminal or null if not found
   */
  static async findById(id: number): Promise<Terminal | null> {
    try {
      const terminal = await prisma.terminals.findUnique({
        where: { id },
      });
      
      if (!terminal) return null;
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error finding terminal by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find a terminal by serial number
   * @param serialNumber - The serial number of the terminal to find
   * @returns The terminal or null if not found
   */
  static async findBySerialNumber(serialNumber: string): Promise<Terminal | null> {
    try {
      const terminal = await prisma.terminals.findUnique({
        where: { serial_number: serialNumber },
      });
      
      if (!terminal) return null;
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error finding terminal by serial number: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Store a new terminal in DB
   * @param data - The data for the terminal to create
   * @returns The created terminal or null if an error occurs
   */
  static async create(data: TerminalCreateInput): Promise<Terminal | null> {
    try {
      const terminal = await prisma.terminals.create({
        data: {
          serial_number: data.serial_number,
          firmware: data.firmware,
          terminal_type: data.terminal_type,
          last_seen: data.last_seen || new Date(),
          customer_id: data.customer_id
        }
      });
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error creating terminal: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a terminal in DB
   * @param id - The ID of the terminal to update
   * @param data - The data for the terminal to update
   * @returns The updated terminal or null if an error occurs
   */
  static async update(id: number, data: TerminalUpdateInput): Promise<Terminal | null> {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (data.serial_number !== undefined) updateData.serial_number = data.serial_number;
      if (data.firmware !== undefined) updateData.firmware = data.firmware;
      if (data.terminal_type !== undefined) updateData.terminal_type = data.terminal_type;
      if (data.last_seen !== undefined) updateData.last_seen = data.last_seen;
      if (data.customer_id !== undefined) {
        updateData.customer_id = data.customer_id;
      }
      
      const terminal = await prisma.terminals.update({
        where: { id },
        data: updateData,
      });
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error updating terminal: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update a terminal's last seen timestamp
   * @param id - The ID of the terminal to update
   * @returns The updated terminal or null if an error occurs
   */
  static async updateLastSeen(id: number): Promise<Terminal | null> {
    try {
      const terminal = await prisma.terminals.update({
        where: { id },
        data: { last_seen: new Date() },
      });
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error updating terminal last seen: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete a terminal from DB
   * @param id - The ID of the terminal to delete
   * @returns True if the terminal was deleted, false otherwise
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.terminals.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting terminal: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Upsert a terminal - create if it doesn't exist, update if it does
   * @param data - The data for the terminal to upsert
   * @returns The upserted terminal or null if an error occurs
   */
  static async upsert(data: TerminalCreateInput): Promise<Terminal | null> {
    try {
      const terminal = await prisma.terminals.upsert({
        where: { serial_number: data.serial_number },
        create: {
          serial_number: data.serial_number,
          firmware: data.firmware,
          terminal_type: data.terminal_type,
          last_seen: new Date(),
          customer_id: data.customer_id
        },
        update: {
          last_seen: new Date(),
          customer_id: data.customer_id
        }
      });
      
      return {
        ...terminal,
        id: Number(terminal.id),
        customer_id: Number(terminal.customer_id)
      };
    } catch (error) {
      logger.error(`Error upserting terminal: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
} 