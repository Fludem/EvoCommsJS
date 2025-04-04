import prisma from '../utils/prisma';
import logger from '../utils/logger';

/**
 * Employee
 * @param id - The ID of the employee
 * @param name - The name of the employee
 * @param source_terminal_id - The ID of the terminal the employee first came from
 * @param terminal_enroll_id - The Employee's ID(Clocking ID) on the terminal
 * @param created_at - The date and time the employee was created
 * @param updated_at - The date and time the employee was last updated
 */
export interface Employee {
  id: number;
  name: string | null;
  source_terminal_id: number;
  terminal_enroll_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Required fields for creating an employee
 * @param name - The name of the employee
 * @param source_terminal_id - The ID of the terminal the employee first came from
 * @param terminal_enroll_id - The Employee's ID(Clocking ID) on the terminal
 */
export interface EmployeeCreateInput {
  name?: string | null;
  source_terminal_id: number;
  terminal_enroll_id: number;
}

/**
 * Required fields for updating an employee
 * @param name - The name of the employee
 * @param source_terminal_id - The ID of the terminal the employee first came from
 * @param terminal_enroll_id - The Employee's ID(Clocking ID) on the terminal
 */
export interface EmployeeUpdateInput {
  name?: string | null;
  source_terminal_id?: number;
  terminal_enroll_id?: number;
}

/**
 * Employee repository for interacting with the employees table
 */
export class EmployeeRepository {
  /**
   * Find all employees
   * @returns All employees
   */
  static async findAll(): Promise<Employee[]> {
    try {
      const results = await prisma.employees.findMany();
      return results.map(employee => ({
        ...employee,
        id: Number(employee.id),
        source_terminal_id: Number(employee.source_terminal_id),
        terminal_enroll_id: Number(employee.terminal_enroll_id)
      }));
    } catch (error) {
      logger.error(`Error finding all employees: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Find an employee by ID
   * @param id - The ID of the employee to find
   * @returns The employee or null if not found
   */
  static async findById(id: number): Promise<Employee | null> {
    try {
      const employee = await prisma.employees.findUnique({
        where: { id },
      });
      
      if (!employee) return null;
      
      return {
        ...employee,
        id: Number(employee.id),
        source_terminal_id: Number(employee.source_terminal_id),
        terminal_enroll_id: Number(employee.terminal_enroll_id)
      };
    } catch (error) {
      logger.error(`Error finding employee by ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Find an employee by terminal enroll ID
   * @param sourceTerminalId - The ID of the source terminal
   * @param terminalEnrollId - The ID of the terminal enroll
   * @returns The employee or null if not found
   */
  static async findByTerminalEnrollId(
    sourceTerminalId: number,
    terminalEnrollId: number
  ): Promise<Employee | null> {
    try {
      const employee = await prisma.employees.findFirst({
        where: {
          source_terminal_id: sourceTerminalId,
          terminal_enroll_id: terminalEnrollId,
        },
      });
      
      if (!employee) return null;
      
      return {
        ...employee,
        id: Number(employee.id),
        source_terminal_id: Number(employee.source_terminal_id),
        terminal_enroll_id: Number(employee.terminal_enroll_id)
      };
    } catch (error) {
      logger.error(`Error finding employee by terminal enroll ID: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Create a new employee
   * @param data - The data for the employee to create
   * @returns The created employee or null if an error occurs
   */
  static async create(data: EmployeeCreateInput): Promise<Employee | null> {
    try {
      const employee = await prisma.employees.create({ 
        data: {
          name: data.name,
          source_terminal_id: data.source_terminal_id,
          terminal_enroll_id: data.terminal_enroll_id
        }
      });
      
      return {
        ...employee,
        id: Number(employee.id),
        source_terminal_id: Number(employee.source_terminal_id),
        terminal_enroll_id: Number(employee.terminal_enroll_id)
      };
    } catch (error) {
      logger.error(`Error creating employee: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Update an employee in DB
   * @param id - The ID of the employee to update
   * @param data - The data for the employee to update
   * @returns The updated employee or null if an error occurs
   */
  static async update(id: number, data: EmployeeUpdateInput): Promise<Employee | null> {
    try {
      const employee = await prisma.employees.update({
        where: { id },
        data,
      });
      
      return {
        ...employee,
        id: Number(employee.id),
        source_terminal_id: Number(employee.source_terminal_id),
        terminal_enroll_id: Number(employee.terminal_enroll_id)
      };
    } catch (error) {
      logger.error(`Error updating employee: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Delete an employee from DB
   * @param id - The ID of the employee to delete
   * @returns True if the employee was deleted, false otherwise
   */
  static async delete(id: number): Promise<boolean> {
    try {
      await prisma.employees.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error(`Error deleting employee: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
} 