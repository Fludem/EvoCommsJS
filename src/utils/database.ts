import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables
dotenv.config();

// Check for required environment variables
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  logger.error('Missing DATABASE_URL environment variable');
  process.exit(1);
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Needed for some cloud database providers like Supabase
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Test the database connection
export const testConnection = async (): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    logger.info(`Connected to PostgreSQL database at ${result.rows[0].now}`);
    return true;
  } catch (err) {
    logger.error(`Failed to connect to database: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  } finally {
    client.release();
  }
};

// Handle unexpected errors on idle clients
pool.on('error', (err) => {
  logger.error(`Unexpected error on idle client: ${err.message}`);
  process.exit(-1);
});

export default pool; 