import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  logger.error('Missing DATABASE_URL environment variable');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

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

pool.on('error', (err) => {
  logger.error(`Unexpected error on idle client: ${err.message}`);
  process.exit(-1);
});

export default pool; 