import { WebSocket } from 'ws';
import { ServerToTerminalCommand } from '@/comms/TimyAI/types/shared';

/**
 * Represents a connection to a TimyAI terminal
 */
export interface ITerminalConnection {
  /**
   * Get the serial number of the connected terminal
   */
  getSerialNumber(): string;
  
  /**
   * Send a command to the terminal
   * @param command A valid server-to-terminal command
   * @returns True if the command was sent successfully, false otherwise
   */
  sendCommand(command: ServerToTerminalCommand): boolean;
  
  /**
   * Underlying WebSocket connection
   */
  getWebSocket(): WebSocket;
  
  /**
   * Disconnect the terminal
   */
  disconnect(code?: number, reason?: string): void;
} 