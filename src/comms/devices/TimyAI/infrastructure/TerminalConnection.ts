import { WebSocket } from 'ws';
import { instanceToPlain } from 'class-transformer';
import { createLogger } from '../../../../utils/logger';
import { ServerToTerminalCommand } from '../types/shared';
import { ITerminalConnection } from '../application/interfaces/ITerminalConnection';

export class TerminalConnection implements ITerminalConnection {
  private readonly logger = createLogger('TerminalConnection');
  
  /**
   * Constructor
   * @param serialNumber - The serial number of the terminal
   * @param ws - The WebSocket connection
   */
  constructor(
    private readonly serialNumber: string,
    private readonly ws: WebSocket
  ) {}

  /**
   * Get the serial number of the terminal
   * @returns The serial number
   */
  getSerialNumber(): string {
    return this.serialNumber;
  }

  /**
   * Get the WebSocket connection
   * @returns The WebSocket connection
   */
  getWebSocket(): WebSocket {
    return this.ws;
  }

  /**
   * Send a command to the terminal
   * @param commandInstance - The command to send
   * @returns Whether the command was sent successfully
   */
  sendCommand(commandInstance: ServerToTerminalCommand): boolean {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.logger.warn({ serialNumber: this.serialNumber }, 'Terminal connection not open');
      return false;
    }

    try {
      const plainCommand = instanceToPlain(commandInstance);
      this.ws.send(JSON.stringify(plainCommand));
      const commandName = commandInstance.command || 'N/A';
      this.logger.info({ 
        serialNumber: this.serialNumber, 
        command: commandName 
      }, 'Command sent to terminal');
      return true;
    } catch (error) {
      this.logger.error({ 
        serialNumber: this.serialNumber, 
        command: commandInstance.command,
        err: error 
      }, 'Error sending command to terminal');
      return false;
    }
  }

  /**
   * Disconnect from the terminal
   * @param code - The code to close the connection
   * @param reason - The reason for closing the connection
   */
  disconnect(code = 1000, reason = 'Normal closure'): void {
    if (this.ws.readyState !== WebSocket.CLOSED && this.ws.readyState !== WebSocket.CLOSING) {
      this.logger.info({ 
        serialNumber: this.serialNumber, 
        code, 
        reason 
      }, 'Disconnecting terminal');
      this.ws.close(code, reason);
    }
  }
} 