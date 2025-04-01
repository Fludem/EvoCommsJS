import prisma from '../utils/prisma';
import logger from '../utils/logger';

// Define the types we need explicitly
export interface Employee {
  id: bigint;
  name: string | null;
  source_terminal_id: bigint;
  terminal_enroll_id: bigint;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeCreateInput {
  name?: string | null;
  source_terminal_id: number;
  terminal_enroll_id: number;
}

export interface EmployeeUpdateInput {
  name?: string | null;
  source_terminal_id?: number;
  terminal_enroll_id?: number;
}

export class EmployeeRepository {
  /**
   * Find all employees
   */
  static async findAll(): Promise<Employee[]> {
    try {
      return await prisma.employees.findMany();
    } catch (error) {
      logger.error(`Error finding all employees: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find an employee by ID
   */
  static async findById(id: number): Promise<Employee | null> {
    try {
      return await prisma.employees.findUnique({
        where: { id: BigInt(id) },
      });
    } catch (error) {
      logger.error(`Error finding employee by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find an employee by terminal enroll ID
   */
  static async findByTerminalEnrollId(
    sourceTerminalId: number,
    terminalEnrollId: number
  ): Promise<Employee | null> {
    try {
      return await prisma.employees.findFirst({
        where: {
          source_terminal_id: BigInt(sourceTerminalId),
          terminal_enroll_id: BigInt(terminalEnrollId),
        },
      });
    } catch (error) {
      logger.error(`Error finding employee by terminal enroll ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Create a new employee
   */
  static async create(data: EmployeeCreateInput): Promise<Employee | null> {
    try {
      // Convert number fields to BigInt
      const employeeData = {
        ...data,
        source_terminal_id: BigInt(data.source_terminal_id),
        terminal_enroll_id: BigInt(data.terminal_enroll_id)
      };
      
      return await prisma.employees.create({ data: employeeData });
    } catch (error) {
      logger.error(`Error creating employee: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update an employee
   */
  static async update(id: number, data: EmployeeUpdateInput): Promise<Employee | null> {
    try {
      // Convert number fields to BigInt if present
      const updateData: Record<string, unknown> = { ...data };
      if (data.source_terminal_id !== undefined) {
        updateData.source_terminal_id = BigInt(data.source_terminal_id);
      }
      if (data.terminal_enroll_id !== undefined) {
        updateData.terminal_enroll_id = BigInt(data.terminal_enroll_id);
      }
      
      return await prisma.employees.update({
        where: { id: BigInt(id) },
        data: updateData,
      });
    } catch (error) {
      logger.error(`Error updating employee: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete an employee
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.employees.delete({
        where: { id: BigInt(id) },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting employee: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 