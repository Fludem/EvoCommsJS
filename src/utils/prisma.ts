import { PrismaClient } from '@prisma/client';
import logger from './logger';

// Define global type for Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, we can reuse the same instance across hot reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

const extendedPrisma = prisma.$extends({
  name: 'queryLogger',
  query: {
    async $allOperations({ operation, model, args, query }) {
      const before = Date.now();
      const result = await query(args);
      const after = Date.now();
      logger.debug(`Query ${model}.${operation} took ${after - before}ms`);
      return result;
    },
  },
});

/**
 * Test the database connection
 * @returns True if the connection is successful, false otherwise
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await extendedPrisma.$queryRaw`SELECT NOW()`;
    logger.info(`Connected to PostgreSQL database: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    logger.error(`Failed to connect to database: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
};

export default extendedPrisma; 