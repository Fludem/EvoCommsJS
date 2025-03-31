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
   */
  getConnection(serialNumber: string): ITerminalConnection | undefined;
  
  /**
   * Get all connected terminal serial numbers
   */
  getConnectedTerminals(): string[];
  
  /**
   * Remove a connection by WebSocket
   */
  removeConnection(ws: WebSocket): string | null;
} 