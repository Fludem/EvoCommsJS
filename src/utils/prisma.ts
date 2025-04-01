import { PrismaClient } from '@prisma/client';
import logger from './logger';

// Define global type for Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
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

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT NOW()`;
    logger.info(`Connected to PostgreSQL database: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    logger.error(`Failed to connect to database: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
};

// Add middleware to log queries (optional)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
prisma.$use(async (params: any, next: any) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  if (params.model && params.action) {
    logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
  } else {
    logger.debug(`Query took ${after - before}ms`);
  }
  return result;
});

export default prisma; 