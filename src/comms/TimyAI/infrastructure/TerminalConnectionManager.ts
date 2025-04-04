import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { ITerminalConnectionManager } from '../application/interfaces/ITerminalConnectionManager';
import { ITerminalConnection } from '../application/interfaces/ITerminalConnection';
import { TerminalConnection } from './TerminalConnection';
import { createLogger } from '../../../utils/logger';

/**
 * Manages terminal connections
 */
@injectable()
export class TerminalConnectionManager extends EventEmitter implements ITerminalConnectionManager {
  private connections: Map<string, ITerminalConnection> = new Map();
  private readonly logger = createLogger('TerminalConnectionManager');

  constructor() {
    super();
    this.logger.debug('TerminalConnectionManager initialized');
  }

  /**
   * Register a new terminal connection
   * @param serialNumber - The serial number of the terminal
   * @param ws - The WebSocket connection
   */
  registerConnection(serialNumber: string, ws: WebSocket): void {
    const connection = new TerminalConnection(serialNumber, ws);
    this.connections.set(serialNumber, connection);
    this.emit('terminalConnected', serialNumber);
    this.logger.info({ serialNumber }, 'Terminal registered');
  }

  /**
   * Get a connection by serial number
   * @param serialNumber - The serial number of the terminal
   * @returns The connection or undefined if not found
   */
  getConnection(serialNumber: string): ITerminalConnection | undefined {
    return this.connections.get(serialNumber);
  }

  /**
   * Get all connected terminal serial numbers
   * @returns An array of serial numbers
   */
  getConnectedTerminals(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Remove a connection by WebSocket
   * @param ws - The WebSocket connection
   * @returns The serial number of the removed connection or null if not found
   */
  removeConnection(ws: WebSocket): string | null {
    let disconnectedSN: string | null = null;
    
    for (const [serialNumber, connection] of this.connections.entries()) {
      if (connection.getWebSocket() === ws) {
        this.connections.delete(serialNumber);
        disconnectedSN = serialNumber;
        this.emit('terminalDisconnected', serialNumber);
        this.logger.info({ serialNumber }, 'Terminal disconnected');
        break;
      }
    }
    
    return disconnectedSN;
  }
} 