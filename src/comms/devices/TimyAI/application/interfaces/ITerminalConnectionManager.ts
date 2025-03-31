import { WebSocket } from 'ws';
import { ITerminalConnection } from './ITerminalConnection';

export interface ITerminalConnectionManager {
  /**
   * Register a new terminal connection
   * @param serialNumber - The serial number of the terminal
   * @param ws - The WebSocket connection
   */
  registerConnection(serialNumber: string, ws: WebSocket): void;
  
  /**
   * Get a connection by serial number
   * @param serialNumber - The serial number of the terminal
   * @returns The connection or undefined if not found
   */
  getConnection(serialNumber: string): ITerminalConnection | undefined;
  
  /**
   * Get all connected terminal serial numbers
   * @returns An array of serial numbers
   */
  getConnectedTerminals(): string[];
  
  /**
   * Remove a connection by WebSocket
   * @param ws - The WebSocket connection
   * @returns The serial number of the removed connection or null if not found
   */
  removeConnection(ws: WebSocket): string | null;
} 