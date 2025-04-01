import 'reflect-metadata';
import { Server } from "./server";
import logger from './utils/logger';
import { registerServices } from './di/container';

async function main() {
  try {
    // Initialize the dependency injection container
    registerServices();
    
    const server = new Server();
    await server.start();
    logger.info("EvoComms service started successfully");
  } catch (error) {
    logger.error(`Failed to start EvoComms service: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
