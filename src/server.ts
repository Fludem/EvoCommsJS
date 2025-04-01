import { TimyAIServer } from './comms/TimyAI/TimyAIServer';
import { TimyTerminal } from './comms/TimyAI/types/shared';
import { testConnection as testDbConnection } from './utils/prisma';
import logger from './utils/logger';
import container from './di/container';

// Define types for events
interface ClockingData {
  terminalSN: string;
  enrollId: number;
  timestamp: string;
  mode?: number;
  inOut?: number;
  event?: number;
  [key: string]: unknown;
}

interface UserData {
  terminalSN: string;
  enrollId: number;
  name?: string;
  [key: string]: unknown;
}

export class Server {
  private protocolServers: Map<string, TimyAIServer> = new Map();
  private timyServer: TimyAIServer;

  constructor() {
    // Resolve TimyAIServer from the DI container
    this.timyServer = container.resolve(TimyAIServer);
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for the TimyAI server
   * @todo add top level handlers for none device specific logic 
   */
  private setupEventHandlers(): void {
    this.timyServer.on('terminalRegistered', (terminal: TimyTerminal) => {
      logger.info(`Main Server: Terminal registered: ${terminal.serialNumber}`);
      // Top level event for when a terminal connects and sends reg command
    });

    this.timyServer.on('clockingReceived', (data: ClockingData) => {
      logger.info(`Main Server: Clocking received from terminal: ${data.terminalSN}`);
      // top level event for when a terminal sends a clocking
    });

    this.timyServer.on('userDataReceived', (data: UserData) => {
      logger.info(`Main Server: User data received: ${data.enrollId}`);
      // top level event for when a terminal sends user data
    });

    this.timyServer.on('terminalDisconnected', (serialNumber: string) => {
      logger.info(`Main Server: Terminal disconnected: ${serialNumber}`);
      // top level event for when a terminal disconnects
    });
  }

  async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.initializeServers();
      await this.startListening();
    } catch (error) {
      logger.error(`Error starting main server: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private async initializeDatabase(): Promise<void> {
    logger.info('Initializing database connection...');
    const connected = await testDbConnection();
    if (!connected) {
      throw new Error('Failed to connect to database. Please check your database configuration.');
    }
  }

  private async initializeServers(): Promise<void> {
    logger.info('Initializing communication servers...');
    this.protocolServers.set('TimyAI', this.timyServer);
  }

  private async startListening(): Promise<void> {
    logger.info('Starting communication servers...');
    this.timyServer.start();
  }

  public async stop(): Promise<void> {
    logger.info('Stopping main server and communication servers...');
    this.timyServer.stop();
  }
}
