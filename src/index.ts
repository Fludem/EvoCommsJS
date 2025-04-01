import 'reflect-metadata';
import { Server } from "./server";
import logger from './utils/logger';

async function main() {
  try {
    const server = new Server();
    await server.start();
    logger.info("EvoComms service started successfully");
  } catch (error) {
    logger.error(`Failed to start EvoComms service: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
