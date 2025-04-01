import pool from './database';
import logger from './logger';

// Helper type for query parameters
type QueryParams = Array<string | number | boolean | null | Date>;

// Schema name
const SCHEMA = 'evocomms';

/**
 * Helper to convert an object to Record<string, unknown> without TypeScript errors
 */
function toRecord<T>(obj: T): Record<string, unknown> {
  return obj as unknown as Record<string, unknown>;
}

/**
 * Execute a query with error handling
 * @param text The SQL query text
 * @param params The query parameters
 * @returns The query result or null on error
 */
export async function query<T = Record<string, unknown>>(text: string, params: QueryParams = []): Promise<T[] | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (err) {
    logger.error(`Database query error: ${err instanceof Error ? err.message : String(err)}`);
    logger.error(`Query: ${text}`);
    logger.error(`Params: ${JSON.stringify(params)}`);
    return null;
  } finally {
    client.release();
  }
}

/**
 * Execute a query and return a single row
 * @param text The SQL query text
 * @param params The query parameters
 * @returns A single row or null if not found or on error
 */
export async function querySingle<T = Record<string, unknown>>(text: string, params: QueryParams = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

/**
 * Insert a record into a table
 * @param table The table name
 * @param data The record data as an object
 * @returns The inserted record or null on error
 */
export async function insert<T = Record<string, unknown>>(
  table: string, 
  data: Record<string, unknown>
): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');
  
  const text = `
    INSERT INTO ${SCHEMA}.${table} (${columns}) 
    VALUES (${placeholders}) 
    RETURNING *
  `;
  
  return querySingle<T>(text, values as QueryParams);
}

/**
 * Update a record in a table
 * @param table The table name
 * @param id The record ID
 * @param data The record data to update
 * @returns The updated record or null on error
 */
export async function update<T = Record<string, unknown>>(
  table: string, 
  id: number,
  data: Record<string, unknown>
): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  // Create SET part of query: "column1 = $1, column2 = $2"
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
  // Add ID as the last parameter
  values.push(id);
  
  const text = `
    UPDATE ${SCHEMA}.${table} 
    SET ${setClause}, updated_at = NOW() 
    WHERE id = $${values.length} 
    RETURNING *
  `;
  
  return querySingle<T>(text, values as QueryParams);
}

/**
 * Delete a record from a table
 * @param table The table name
 * @param id The record ID
 * @returns True if successful, false on error
 */
export async function remove(table: string, id: number): Promise<boolean> {
  const text = `DELETE FROM ${SCHEMA}.${table} WHERE id = $1`;
  
  const client = await pool.connect();
  try {
    const result = await client.query(text, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (err) {
    logger.error(`Database delete error: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  } finally {
    client.release();
  }
}

// Table-specific types and operations

// Clockings
export interface ClockingRecord {
  id?: number;
  employee_id: number;
  terminal_id: number;
  time: string;
  sent_to_api?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Terminals
export interface TerminalRecord {
  id?: number;
  serial_number: string;
  firmware: string;
  terminal_type: 'TIMYAI' | 'VF200' | 'ANVIZ' | 'CS100' | 'ZKTECO';
  customer_id?: number | null;
  last_seen: string;
  created_at?: string;
  updated_at?: string;
}

// Employees
export interface EmployeeRecord {
  id?: number;
  name?: string | null;
  source_terminal_id: number;
  terminal_enroll_id: number;
  created_at?: string;
  updated_at?: string;
}

// Customers
export interface CustomerRecord {
  id?: number;
  company_name?: string | null;
  domain?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Table-specific operations
export const DB = {
  // Clockings operations
  clockings: {
    async findAll(): Promise<ClockingRecord[] | null> {
      return query<ClockingRecord>(`SELECT * FROM ${SCHEMA}.clockings ORDER BY time DESC`);
    },
    
    async findById(id: number): Promise<ClockingRecord | null> {
      return querySingle<ClockingRecord>(
        `SELECT * FROM ${SCHEMA}.clockings WHERE id = $1`, 
        [id]
      );
    },
    
    async findByEmployeeId(employeeId: number): Promise<ClockingRecord[] | null> {
      return query<ClockingRecord>(
        `SELECT * FROM ${SCHEMA}.clockings WHERE employee_id = $1 ORDER BY time DESC`, 
        [employeeId]
      );
    },
    
    async create(clocking: ClockingRecord): Promise<ClockingRecord | null> {
      return insert<ClockingRecord>('clockings', toRecord(clocking));
    },
    
    async update(id: number, data: Partial<ClockingRecord>): Promise<ClockingRecord | null> {
      return update<ClockingRecord>('clockings', id, toRecord(data));
    },
    
    async delete(id: number): Promise<boolean> {
      return remove('clockings', id);
    }
  },
  
  // Terminals operations
  terminals: {
    async findAll(): Promise<TerminalRecord[] | null> {
      return query<TerminalRecord>(`SELECT * FROM ${SCHEMA}.terminals ORDER BY id`);
    },
    
    async findById(id: number): Promise<TerminalRecord | null> {
      return querySingle<TerminalRecord>(
        `SELECT * FROM ${SCHEMA}.terminals WHERE id = $1`, 
        [id]
      );
    },
    
    async findBySerialNumber(serialNumber: string): Promise<TerminalRecord | null> {
      return querySingle<TerminalRecord>(
        `SELECT * FROM ${SCHEMA}.terminals WHERE serial_number = $1`, 
        [serialNumber]
      );
    },
    
    async create(terminal: TerminalRecord): Promise<TerminalRecord | null> {
      return insert<TerminalRecord>('terminals', toRecord(terminal));
    },
    
    async update(id: number, data: Partial<TerminalRecord>): Promise<TerminalRecord | null> {
      return update<TerminalRecord>('terminals', id, toRecord(data));
    },
    
    async updateLastSeen(id: number): Promise<TerminalRecord | null> {
      return update<TerminalRecord>('terminals', id, toRecord({ last_seen: new Date().toISOString() }));
    },
    
    async delete(id: number): Promise<boolean> {
      return remove('terminals', id);
    }
  },
  
  // Employees operations
  employees: {
    async findAll(): Promise<EmployeeRecord[] | null> {
      return query<EmployeeRecord>(`SELECT * FROM ${SCHEMA}.employees ORDER BY id`);
    },
    
    async findById(id: number): Promise<EmployeeRecord | null> {
      return querySingle<EmployeeRecord>(
        `SELECT * FROM ${SCHEMA}.employees WHERE id = $1`, 
        [id]
      );
    },
    
    async findByTerminalEnrollId(terminalId: number, enrollId: number): Promise<EmployeeRecord | null> {
      return querySingle<EmployeeRecord>(
        `SELECT * FROM ${SCHEMA}.employees 
         WHERE source_terminal_id = $1 AND terminal_enroll_id = $2`, 
        [terminalId, enrollId]
      );
    },
    
    async create(employee: EmployeeRecord): Promise<EmployeeRecord | null> {
      return insert<EmployeeRecord>('employees', toRecord(employee));
    },
    
    async update(id: number, data: Partial<EmployeeRecord>): Promise<EmployeeRecord | null> {
      return update<EmployeeRecord>('employees', id, toRecord(data));
    },
    
    async delete(id: number): Promise<boolean> {
      return remove('employees', id);
    }
  },
  
  // Customers operations
  customers: {
    async findAll(): Promise<CustomerRecord[] | null> {
      return query<CustomerRecord>(`SELECT * FROM ${SCHEMA}.customers ORDER BY id`);
    },
    
    async findById(id: number): Promise<CustomerRecord | null> {
      return querySingle<CustomerRecord>(
        `SELECT * FROM ${SCHEMA}.customers WHERE id = $1`, 
        [id]
      );
    },
    
    async create(customer: CustomerRecord): Promise<CustomerRecord | null> {
      return insert<CustomerRecord>('customers', toRecord(customer));
    },
    
    async update(id: number, data: Partial<CustomerRecord>): Promise<CustomerRecord | null> {
      return update<CustomerRecord>('customers', id, toRecord(data));
    },
    
    async delete(id: number): Promise<boolean> {
      return remove('customers', id);
    }
  }
}; 