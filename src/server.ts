import { TimyAIServer } from './comms/TimyAI/TimyAIServer';
import { TimyTerminal } from './comms/TimyAI/types/shared';
import { testConnection as testDbConnection } from './utils/prisma';
import logger from './utils/logger';
import container from './di/container';
import express from 'express';
import { setupAPI } from './api';
import { ActivityLogService, ActivityType, TargetType, ActionType } from './services/activity-log.service';
import { TerminalRepository } from './repositories/terminal.repository';

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

// Extended TimyTerminal interface to
//  include potential firmware property
// that isn't stored in DB yet, TODO: Remove this and change DB
interface ExtendedTimyTerminal extends TimyTerminal {
  firmware?: string;
}

export class Server {
  private protocolServers: Map<string, TimyAIServer> = new Map();
  private timyServer: TimyAIServer;
  private expressApp: express.Express;
  private apiPort: number;

  constructor() {
    // Resolve TimyAIServer from the DI container
    this.timyServer = container.resolve(TimyAIServer);
    this.setupEventHandlers();
    
    // Initialize Express app
    this.expressApp = express();
    this.apiPort = parseInt(process.env.API_PORT || '3000', 10);
  }

  /**
   * Setup event handlers for the TimyAI server
   * @todo add top level handlers for none device specific logic 
   */
  private setupEventHandlers(): void {
    this.timyServer.on('terminalRegistered', async (terminal: TimyTerminal) => {
      logger.info(`Main Server: Terminal registered: ${terminal.serialNumber}`);
      
      // Find the terminal in the database to get its ID
      const terminalData = await TerminalRepository.findBySerialNumber(terminal.serialNumber);
      
      if (terminalData) {
        // Log terminal registration
        const extendedTerminal = terminal as ExtendedTimyTerminal;
        
        await ActivityLogService.logTerminalRegistered(
          terminalData.id,
          terminal.serialNumber,
          terminalData.customer_id,
          {
            ...(extendedTerminal.firmware && { firmware: extendedTerminal.firmware }),
            terminal_type: terminalData.terminal_type
          }
        );
      }
    });

    this.timyServer.on('clockingReceived', async (data: ClockingData) => {
      logger.info(`Main Server: Clocking received from terminal: ${data.terminalSN}`);
      
      // Find the terminal in the database to get its ID
      const terminal = await TerminalRepository.findBySerialNumber(data.terminalSN);
      
      if (terminal) {
        // We can't directly log the clocking creation here because we don't have the clocking ID yet
        // A better approach would be to log this in the handler that actually creates the clocking
        // But for now, we can log a generic activity
        await ActivityLogService.logActivity(
          ActivityType.CLOCKING_CREATED,
          terminal.id,
          TargetType.CLOCKING,
          null, // We don't know the clocking ID yet
          ActionType.CREATE,
          {
            employee_enroll_id: data.enrollId,
            timestamp: data.timestamp,
            terminal_sn: data.terminalSN
          }
        );
      }
    });

    this.timyServer.on('userDataReceived', async (data: UserData) => {
      logger.info(`Main Server: User data received: ${data.enrollId}`);
      
      // Find the terminal in the database to get its ID
      const terminal = await TerminalRepository.findBySerialNumber(data.terminalSN);
      
      if (terminal) {
        // Log user data received (employee creation/update)
        await ActivityLogService.logActivity(
          ActivityType.EMPLOYEE_CREATED,
          terminal.id,
          TargetType.EMPLOYEE,
          null, // We don't know the employee ID yet
          ActionType.CREATE,
          {
            employee_enroll_id: data.enrollId,
            employee_name: data.name,
            terminal_sn: data.terminalSN
          }
        );
      }
    });

    this.timyServer.on('terminalDisconnected', async (serialNumber: string) => {
      logger.info(`Main Server: Terminal disconnected: ${serialNumber}`);
      
      // Find the terminal in the database to get its ID
      const terminal = await TerminalRepository.findBySerialNumber(serialNumber);
      
      if (terminal) {
        // Log terminal disconnection
        await ActivityLogService.logTerminalDisconnected(
          terminal.id,
          serialNumber,
          {
            disconnected_at: new Date().toISOString()
          }
        );
      }
    });
  }

  async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.initializeServers();
      await this.initializeAPI();
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

  private async initializeAPI(): Promise<void> {
    logger.info('Initializing API server...');
    setupAPI(this.expressApp);
  }

  private async startListening(): Promise<void> {
    logger.info('Starting communication servers...');
    this.timyServer.start();
    
    // Start Express API server
    this.expressApp.listen(this.apiPort, () => {
      logger.info(`API server listening on port ${this.apiPort}`);
    });
  }

  public async stop(): Promise<void> {
    logger.info('Stopping main server and communication servers...');
    this.timyServer.stop();
  }
}
