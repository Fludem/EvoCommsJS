import { EventEmitter } from 'events';
import dotenv from 'dotenv';
import { injectable, inject, container } from 'tsyringe';
import { ServerToTerminalCommand } from './types/shared';
import { WebSocketServerAdapter } from './infrastructure/WebSocketServerAdapter';
import { ITerminalConnectionManager } from './application/interfaces/ITerminalConnectionManager';
import { createLogger } from '../../utils/logger';

dotenv.config();

/**
 * TimyAI Server - Main entry point for handling TimyAI terminals
 * 
 * This class provides a facade for the TimyAI terminal management system
 */
@injectable()
export class TimyAIServer extends EventEmitter {
  /**
   * Read port from environment variable with fallback to 7788
   */
  private readonly PORT = parseInt(process.env.TIMYAI_PORT || '7788', 10);
  private readonly logger = createLogger('TimyAIServer');
  private readonly wsServer: WebSocketServerAdapter;
  
  constructor(
    @inject('ITerminalConnectionManager') private readonly connectionManager: ITerminalConnectionManager
  ) {
    super();
    
    this._forwardEvents(this.connectionManager as unknown as EventEmitter);
    
    this.wsServer = container.resolve(WebSocketServerAdapter);
    
    this._forwardEvents(this.wsServer);

    this.logger.info({ port: this.PORT }, 'TimyAI server initialized');
  }

  /**
   * Start the TimyAI server
   */
  public start(): void {
    this.logger.info('TimyAI server handler started.');
    this.wsServer.start();
  }

  /**
   * Stop the TimyAI server
   */
  public stop(): void {
    this.logger.info('Stopping TimyAI server...');
    this.wsServer.stop().catch(err => {
      this.logger.error({ err }, 'Error stopping TimyAI server');
    });
  }

  /**
   * Get all connected terminal serial numbers
   * @returns An array of serial numbers
   */
  public getConnectedTerminals(): string[] {
    return this.connectionManager.getConnectedTerminals();
  }

  /**
   * Send a command to a specific terminal
   * @param serialNumber The serial number of the terminal to send the command to
   * @param commandInstance The command to send (must be a server-to-terminal command)
   * @returns True if the command was sent successfully, false otherwise
   */
  public sendCommand(serialNumber: string, commandInstance: ServerToTerminalCommand): boolean {
    const connection = this.connectionManager.getConnection(serialNumber);
    if (!connection) {
      this.logger.warn({ serialNumber }, 'Terminal not connected');
      return false;
    }
    
    return connection.sendCommand(commandInstance);
  }

  /**
   * Forward events from source to this EventEmitter
   * @param source - The source event emitter
   */
  private _forwardEvents(source: EventEmitter): void {
    const forwardEvent = (event: string, ...args: unknown[]) => {
      this.emit(event, ...args);
    };
    
    // Forward all events from source
    source.on('terminalConnected', (...args) => {
      this.logger.info({ terminal: args[0] }, 'Terminal connected');
      forwardEvent('terminalConnected', ...args);
    });
    
    source.on('terminalDisconnected', (...args) => {
      this.logger.info({ terminal: args[0] }, 'Terminal disconnected');
      forwardEvent('terminalDisconnected', ...args);
    });
    
    source.on('error', (...args) => {
      this.logger.error({ err: args[0] }, 'Terminal error occurred');
      forwardEvent('error', ...args);
    });
  }
} 